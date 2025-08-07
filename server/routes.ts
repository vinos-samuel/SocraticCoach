import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Anthropic from '@anthropic-ai/sdk';
import multer from "multer";
import fs from "fs";
import path from "path";
import mammoth from "mammoth";

// The newest Anthropic model is "claude-sonnet-4-20250514", not "claude-3-7-sonnet-20250219", "claude-3-5-sonnet-20241022" nor "claude-3-sonnet-20240229"
const DEFAULT_MODEL_STR = "claude-sonnet-4-20250514";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY || "default_key",
});

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// Helper function to extract text from different file types
async function extractTextFromFile(filePath: string, mimetype: string): Promise<string> {
  try {
    if (mimetype === 'text/plain') {
      return fs.readFileSync(filePath, 'utf8');
    } else if (mimetype === 'application/pdf') {
      // Dynamic import to avoid initialization issues
      const pdfParse = (await import('pdf-parse')).default;
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } else if (mimetype === 'application/msword') {
      // For .doc files, we'll try mammoth but it may not work perfectly
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    throw error;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Document upload endpoint
  app.post("/api/upload-document", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const filePath = req.file.path;
      const mimetype = req.file.mimetype;

      // Extract text from the uploaded file
      const extractedText = await extractTextFromFile(filePath, mimetype);
      
      // Clean up the uploaded file
      fs.unlinkSync(filePath);

      if (!extractedText.trim()) {
        return res.status(400).json({ error: "Could not extract text from the document" });
      }

      // Truncate if too long (keep reasonable limit for processing)
      const maxLength = 5000;
      const content = extractedText.length > maxLength 
        ? extractedText.substring(0, maxLength) + "..."
        : extractedText;

      res.json({ 
        content: content.trim(),
        originalLength: extractedText.length,
        truncated: extractedText.length > maxLength
      });

    } catch (error) {
      console.error('Error processing document:', error);
      
      // Clean up file if it exists
      if (req.file?.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
          console.error('Error cleaning up file:', cleanupError);
        }
      }

      res.status(500).json({ error: "Failed to process document" });
    }
  });
  // Generate Socratic question
  app.post("/api/generate-question", async (req, res) => {
    try {
      const { problem, questions, isFirst } = req.body;

      if (!problem) {
        return res.status(400).json({ error: "Problem description is required" });
      }

      const conversationHistory = questions?.map((q: any) => 
        `Question: ${q.question}\nAnswer: ${q.answer}`
      ).join('\n\n') || '';
      
      const prompt = isFirst 
        ? `You are a Socratic thinking coach. The user has described this problem: "${problem}"
        
        Generate a thoughtful Socratic question that will help them think more clearly about their situation. The question should:
        - Be open-ended and thought-provoking
        - Help them examine their assumptions
        - Encourage deeper reflection
        - Be specific to their situation
        
        Respond with ONLY the question, no additional text.`
        
        : `You are a Socratic thinking coach. Here's the user's original problem and our conversation so far:
        
        Original problem: "${problem}"
        
        Conversation history:
        ${conversationHistory}
        
        Generate the next thoughtful Socratic question that builds on their previous responses and helps them gain deeper insights.
        
        Respond with ONLY the question, no additional text.`;

      const response = await anthropic.messages.create({
        model: DEFAULT_MODEL_STR,
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }]
      });

      const questionText = response.content[0].type === 'text' ? response.content[0].text.trim() : '';
      
      res.json({ question: questionText });
      
    } catch (error) {
      console.error('Error generating question:', error);
      res.status(500).json({ 
        error: "Failed to generate question",
        fallbackQuestion: "What aspect of this situation feels most important to you right now?"
      });
    }
  });

  // Generate summary
  app.post("/api/generate-summary", async (req, res) => {
    try {
      const { problem, questions } = req.body;

      if (!problem || !questions) {
        return res.status(400).json({ error: "Problem and questions are required" });
      }

      const conversationHistory = questions.map((q: any) => 
        `Q: ${q.question}\nA: ${q.answer}`
      ).join('\n\n');
      
      const prompt = `Based on this Socratic dialogue, provide insights and a summary:

      Original problem: "${problem}"
      
      Dialogue:
      ${conversationHistory}
      
      Provide:
      1. Key insights discovered
      2. A clear summary of their situation
      3. Actionable next steps or solutions if appropriate
      
      Format your response in clear, encouraging language that helps them see their progress in thinking through this issue.`;

      const response = await anthropic.messages.create({
        model: DEFAULT_MODEL_STR,
        max_tokens: 600,
        messages: [{ role: "user", content: prompt }]
      });

      const summaryText = response.content[0].type === 'text' ? response.content[0].text : '';
      
      res.json({ summary: summaryText });
      
    } catch (error) {
      console.error('Error generating summary:', error);
      res.status(500).json({ 
        error: "Failed to generate summary",
        fallbackSummary: "Thank you for working through these questions. You've gained valuable insights into your situation through this reflective process."
      });
    }
  });

  // Generate action plan
  app.post("/api/generate-action-plan", async (req, res) => {
    try {
      const { problem, questions } = req.body;

      if (!problem || !questions) {
        return res.status(400).json({ error: "Problem and questions are required" });
      }

      const conversationHistory = questions.map((q: any) => 
        `Q: ${q.question}\nA: ${q.answer}`
      ).join('\n\n');
      
      const prompt = `Based on this Socratic dialogue, create a detailed action plan:

      Original problem: "${problem}"
      
      Dialogue:
      ${conversationHistory}
      
      Create a structured action plan with:
      
      1. **GOAL CLARITY**: Clear objective based on their insights
      2. **KEY DELIVERABLES**: 3-5 specific, actionable deliverables
      3. **TIMELINE**: Realistic timeframes for each deliverable
      4. **MILESTONES**: Check-in points and progress markers
      5. **POTENTIAL OBSTACLES**: What might get in the way and how to handle them
      6. **SUCCESS METRICS**: How they'll know they're making progress
      
      Format this as a clear, actionable plan they can reference and follow. Use encouraging, confident language that builds on the insights they've discovered.`;

      const response = await anthropic.messages.create({
        model: DEFAULT_MODEL_STR,
        max_tokens: 800,
        messages: [{ role: "user", content: prompt }]
      });

      const actionPlanText = response.content[0].type === 'text' ? response.content[0].text : '';
      
      res.json({ actionPlan: actionPlanText });
      
    } catch (error) {
      console.error('Error generating action plan:', error);
      res.status(500).json({ 
        error: "Failed to generate action plan",
        fallbackPlan: "I'll help you create a structured plan to move forward with the insights you've discovered."
      });
    }
  });

  // Coaching chat
  app.post("/api/coaching-chat", async (req, res) => {
    try {
      const { problem, questions, summary, coachingMessages, userMessage } = req.body;

      if (!problem || !userMessage) {
        return res.status(400).json({ error: "Problem and user message are required" });
      }

      const conversationHistory = questions?.map((q: any) => 
        `Q: ${q.question}\nA: ${q.answer}`
      ).join('\n\n') || '';
      
      const fullContext = `You are coaching someone through a problem. Here's the full context:
      
      Original problem: "${problem}"
      
      Socratic dialogue completed:
      ${conversationHistory}
      
      Previous insights: ${summary || 'No summary available yet'}
      
      Conversation history:
      ${coachingMessages?.map((m: any) => `${m.role}: ${m.content}`).join('\n') || ''}
      
      User's latest message: ${userMessage}
      
      Provide helpful, supportive coaching based on all this context.`;

      const response = await anthropic.messages.create({
        model: DEFAULT_MODEL_STR,
        max_tokens: 500,
        messages: [{ role: "user", content: fullContext }]
      });

      const assistantResponse = response.content[0].type === 'text' ? response.content[0].text : '';
      
      res.json({ response: assistantResponse });
      
    } catch (error) {
      console.error('Error in coaching chat:', error);
      res.status(500).json({ 
        error: "Failed to generate coaching response",
        fallbackResponse: "I understand you're working through this challenge. Can you tell me more about what specific aspect you'd like to explore?"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
