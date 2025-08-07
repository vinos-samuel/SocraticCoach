import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, Lightbulb, MessageCircle, CheckCircle, FileText, RotateCcw, Download, Copy, Mail, Share2, Mic } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { VoiceModal } from "@/components/ui/voice-modal";

interface Question {
  question: string;
  answer: string;
}

interface CoachingMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function SocraticCoach() {
  const [stage, setStage] = useState<'initial' | 'questioning' | 'summary' | 'coaching' | 'actionplan'>('initial');
  const [problem, setProblem] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [coachingMessages, setCoachingMessages] = useState<CoachingMessage[]>([]);
  const [coachingInput, setCoachingInput] = useState('');
  const [actionPlan, setActionPlan] = useState('');
  const [maxQuestions] = useState(6);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [lastCoachResponse, setLastCoachResponse] = useState('');
  const [isInitialVoiceModalOpen, setIsInitialVoiceModalOpen] = useState(false);
  const { toast } = useToast();

  const generateQuestion = async (isFirst = false) => {
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/generate-question', {
        problem,
        questions,
        isFirst
      });
      
      const data = await response.json();
      
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
        setCurrentQuestion(data.fallbackQuestion || "What aspect of this situation feels most important to you right now?");
      } else {
        setCurrentQuestion(data.question);
      }
      
      setStage('questioning');
      
    } catch (error) {
      console.error('Error generating question:', error);
      toast({
        title: "Error",
        description: "Failed to generate question. Using fallback.",
        variant: "destructive"
      });
      setCurrentQuestion("What aspect of this situation feels most important to you right now?");
      setStage('questioning');
    }
    
    setIsLoading(false);
  };

  const generateSummary = async () => {
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/generate-summary', {
        problem,
        questions
      });
      
      const data = await response.json();
      
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
        setSummary(data.fallbackSummary || "Thank you for working through these questions. You've gained valuable insights into your situation through this reflective process.");
      } else {
        setSummary(data.summary);
      }
      
      setStage('summary');
      
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Error",
        description: "Failed to generate summary. Using fallback.",
        variant: "destructive"
      });
      setSummary("Thank you for working through these questions. You've gained valuable insights into your situation through this reflective process.");
      setStage('summary');
    }
    
    setIsLoading(false);
  };

  const handleAnswerSubmit = () => {
    if (currentAnswer.trim()) {
      const newQuestions = [...questions, { question: currentQuestion, answer: currentAnswer }];
      setQuestions(newQuestions);
      setCurrentAnswer('');
      setCurrentQuestion('');
      
      if (newQuestions.length >= maxQuestions) {
        generateSummary();
      } else {
        generateQuestion(false);
      }
    }
  };

  const generateActionPlan = async () => {
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/generate-action-plan', {
        problem,
        questions
      });
      
      const data = await response.json();
      
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
        setActionPlan(data.fallbackPlan || "I'll help you create a structured plan to move forward with the insights you've discovered.");
      } else {
        setActionPlan(data.actionPlan);
      }
      
      setStage('actionplan');
      
    } catch (error) {
      console.error('Error generating action plan:', error);
      toast({
        title: "Error",
        description: "Failed to generate action plan. Using fallback.",
        variant: "destructive"
      });
      setActionPlan("I'll help you create a structured plan to move forward with the insights you've discovered.");
      setStage('actionplan');
    }
    
    setIsLoading(false);
  };

  const handleStartCoaching = () => {
    setStage('coaching');
    setCoachingMessages([{
      role: 'assistant',
      content: "I'm here to help you work through your situation. I have full context of your problem and the insights you've discovered through our Socratic dialogue. What would you like to explore further or get help with?"
    }]);
  };

  const handleCoachingSubmit = async () => {
    if (!coachingInput.trim()) return;
    
    const userMessage: CoachingMessage = { role: 'user', content: coachingInput };
    setCoachingMessages(prev => [...prev, userMessage]);
    setCoachingInput('');
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/coaching-chat', {
        problem,
        questions,
        summary,
        coachingMessages,
        userMessage: coachingInput
      });
      
      const data = await response.json();
      
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
        const assistantMessage: CoachingMessage = { 
          role: 'assistant', 
          content: data.fallbackResponse || "I understand you're working through this challenge. Can you tell me more about what specific aspect you'd like to explore?"
        };
        setCoachingMessages(prev => [...prev, assistantMessage]);
      } else {
        const assistantMessage: CoachingMessage = { role: 'assistant', content: data.response };
        setCoachingMessages(prev => [...prev, assistantMessage]);
        setLastCoachResponse(data.response);
      }
      
    } catch (error) {
      console.error('Error in coaching:', error);
      toast({
        title: "Error",
        description: "Failed to get coaching response",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const handleVoiceMessage = (message: string) => {
    setCoachingInput(message);
    handleCoachingSubmit();
  };

  const handleInitialVoiceMessage = (message: string) => {
    setProblem(message);
    // Automatically start the coaching process after voice input
    setTimeout(() => {
      generateQuestion(true);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent, handler: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handler();
    }
  };

  const resetApp = () => {
    setStage('initial');
    setProblem('');
    setQuestions([]);
    setCurrentQuestion('');
    setCurrentAnswer('');
    setSummary('');
    setActionPlan('');
    setCoachingMessages([]);
    setCoachingInput('');
  };

  // Export functions
  const generateSessionText = (includeCoaching = false) => {
    const timestamp = new Date().toLocaleString();
    let content = `SOCRATIC THINKING SESSION\n`;
    content += `Generated: ${timestamp}\n\n`;
    content += `=== ORIGINAL PROBLEM ===\n${problem}\n\n`;
    
    if (questions.length > 0) {
      content += `=== REFLECTION DIALOGUE ===\n`;
      questions.forEach((q, index) => {
        content += `Q${index + 1}: ${q.question}\n`;
        content += `A${index + 1}: ${q.answer}\n\n`;
      });
    }
    
    if (summary) {
      content += `=== INSIGHTS & SUMMARY ===\n${summary}\n\n`;
    }
    
    if (actionPlan) {
      content += `=== ACTION PLAN ===\n${actionPlan}\n\n`;
    }
    
    if (includeCoaching && coachingMessages.length > 0) {
      content += `=== COACHING CONVERSATION ===\n`;
      coachingMessages.forEach((msg, index) => {
        content += `${msg.role.toUpperCase()}: ${msg.content}\n\n`;
      });
    }
    
    return content;
  };

  const downloadAsText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please try downloading instead",
        variant: "destructive"
      });
    }
  };

  const shareViaEmail = (content: string, subject: string) => {
    const emailSubject = encodeURIComponent(subject);
    const emailBody = encodeURIComponent(content);
    const mailtoLink = `mailto:?subject=${emailSubject}&body=${emailBody}`;
    window.open(mailtoLink);
  };

  const handleDownloadSession = () => {
    const content = generateSessionText(stage === 'coaching');
    const filename = `socratic-session-${new Date().toISOString().split('T')[0]}.txt`;
    downloadAsText(content, filename);
  };

  const handleCopySession = () => {
    const content = generateSessionText(stage === 'coaching');
    copyToClipboard(content);
  };

  const handleEmailSession = () => {
    const content = generateSessionText(stage === 'coaching');
    const subject = `Socratic Thinking Session - ${problem.substring(0, 50)}...`;
    shareViaEmail(content, subject);
  };

  const handleDownloadActionPlan = () => {
    if (!actionPlan) return;
    const content = `ACTION PLAN\nGenerated: ${new Date().toLocaleString()}\n\nOriginal Problem: ${problem}\n\n${actionPlan}`;
    const filename = `action-plan-${new Date().toISOString().split('T')[0]}.txt`;
    downloadAsText(content, filename);
  };

  const handleCopyActionPlan = () => {
    if (!actionPlan) return;
    copyToClipboard(actionPlan);
  };

  const handleDownloadCoaching = () => {
    if (coachingMessages.length === 0) return;
    let content = `COACHING CONVERSATION\nGenerated: ${new Date().toLocaleString()}\n\nOriginal Problem: ${problem}\n\n`;
    coachingMessages.forEach((msg) => {
      content += `${msg.role.toUpperCase()}: ${msg.content}\n\n`;
    });
    const filename = `coaching-conversation-${new Date().toISOString().split('T')[0]}.txt`;
    downloadAsText(content, filename);
  };

  const progressPercentage = (questions.length / maxQuestions) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-primary/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Socratic Coach
              </h1>
              <p className="text-sm text-secondary hidden sm:block">Think through challenges with guided questions</p>
            </div>
          </div>
          {stage !== 'initial' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetApp}
              className="text-secondary hover:text-primary"
              data-testid="button-reset"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Progress Indicator */}
        {stage === 'questioning' && (
          <div className="mb-8" data-testid="progress-indicator">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-secondary">Progress</span>
              <span className="text-sm text-secondary">Question {questions.length + 1} of {maxQuestions}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {/* Initial Problem Input */}
        {stage === 'initial' && (
          <Card className="bg-surface shadow-lg border-primary/10" data-testid="card-initial">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  What's on your mind?
                </h2>
                <p className="text-lg text-secondary max-w-2xl mx-auto">
                  Describe the situation, problem, or decision you're facing. I'll help you think through it with thoughtful questions.
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3 text-primary">Describe your challenge</label>
                  <div className="relative">
                    <Textarea
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      placeholder="Tell me about what's challenging you... The more detail you provide, the better I can help you explore it."
                      className="min-h-[140px] border-2 border-primary/20 focus:border-primary/40 pr-14"
                      data-testid="textarea-problem"
                    />
                    <Button
                      onClick={() => setIsInitialVoiceModalOpen(true)}
                      variant="outline"
                      className="absolute top-3 right-3 p-2 border-accent/30 hover:bg-accent/10"
                      data-testid="button-voice-input"
                    >
                      <Mic className="w-4 h-4 text-accent" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-secondary/60">Minimum 20 characters • Click <Mic className="w-3 h-3 inline text-accent" /> to speak</span>
                    <span className="text-sm text-secondary">{problem.length} characters</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => generateQuestion(true)}
                  disabled={problem.length < 20 || isLoading}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 px-6 text-lg font-semibold"
                  data-testid="button-start"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      Start Thinking Session
                      <Lightbulb className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Questioning Stage */}
        {stage === 'questioning' && (
          <div className="space-y-6" data-testid="stage-questioning">
            {/* Previous Q&A History */}
            {questions.map((q, index) => (
              <Card key={index} className="bg-surface shadow-sm border-primary/10 opacity-90" data-testid={`card-qa-${index}`}>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-accent font-semibold text-sm">Q</span>
                      </div>
                      <p className="text-primary font-medium leading-relaxed">{q.question}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 ml-11">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-semibold text-sm">A</span>
                    </div>
                    <p className="text-secondary leading-relaxed">{q.answer}</p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Current Question */}
            {currentQuestion && (
              <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-accent/20" data-testid="card-current-question">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-2">
                        Question {questions.length + 1} of {maxQuestions}
                      </h3>
                      <p className="text-xl text-primary leading-relaxed">{currentQuestion}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Textarea
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="Take your time to reflect... There's no right or wrong answer, just your honest thoughts."
                      onKeyPress={(e) => handleKeyPress(e, handleAnswerSubmit)}
                      className="min-h-[120px] border-2 border-accent/30 focus:border-accent/60 bg-white/50"
                      data-testid="textarea-answer"
                    />
                    
                    <Button
                      onClick={handleAnswerSubmit}
                      disabled={!currentAnswer.trim() || isLoading}
                      className="w-full bg-gradient-to-r from-accent to-primary text-white py-3 px-6 font-semibold"
                      data-testid="button-submit-answer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Continue
                          <MessageCircle className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && stage !== 'coaching' && (
          <Card className="bg-white shadow-lg" data-testid="card-loading">
            <CardContent className="p-8 text-center">
              <Loader2 className="w-10 h-10 mx-auto mb-4 animate-spin text-primary" />
              <p className="text-primary">Reflecting on your thoughts...</p>
            </CardContent>
          </Card>
        )}

        {/* Summary Stage */}
        {stage === 'summary' && (
          <Card className="bg-surface shadow-lg border-primary/10" data-testid="card-summary">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-primary">Insights Discovered</CardTitle>
              <p className="text-lg text-secondary">Here's what we've learned through your reflection</p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none mb-8 text-secondary leading-relaxed whitespace-pre-line">
                {summary}
              </div>

              {/* Export Options for Summary */}
              <div className="mb-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
                <h4 className="text-sm font-semibold text-primary mb-3">Export Your Session</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={handleDownloadSession}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    data-testid="button-download-session"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    onClick={handleCopySession}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    data-testid="button-copy-session"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    onClick={handleEmailSession}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    data-testid="button-email-session"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={generateActionPlan}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-4 px-6 text-lg font-semibold"
                  data-testid="button-action-plan"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Create Action Plan
                </Button>
                
                <Button
                  onClick={handleStartCoaching}
                  variant="outline"
                  className="flex-1 border-2 border-primary text-primary py-4 px-6 text-lg font-semibold hover:bg-primary/5"
                  data-testid="button-coaching"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Get More Coaching
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Plan Stage */}
        {stage === 'actionplan' && (
          <Card className="bg-surface shadow-lg border-primary/10" data-testid="card-action-plan">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-primary">Your Action Plan</CardTitle>
              <p className="text-lg text-secondary">A structured approach to move forward</p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none mb-8 text-secondary leading-relaxed whitespace-pre-line">
                {actionPlan}
              </div>

              {/* Export Options for Action Plan */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-primary mb-3">Save Your Action Plan</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={handleDownloadActionPlan}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    data-testid="button-download-action-plan"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download Plan
                  </Button>
                  <Button
                    onClick={handleCopyActionPlan}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    data-testid="button-copy-action-plan"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy Plan
                  </Button>
                  <Button
                    onClick={handleDownloadSession}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    data-testid="button-download-full-session"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Full Session
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleStartCoaching}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-4 px-6 text-lg font-semibold"
                  data-testid="button-discuss-plan"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Discuss This Plan
                </Button>
                
                <Button
                  onClick={resetApp}
                  variant="outline"
                  className="flex-1 border-2 border-primary text-primary py-4 px-6 text-lg font-semibold hover:bg-primary/5"
                  data-testid="button-new-session"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Start New Session
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Coaching Stage */}
        {stage === 'coaching' && (
          <Card className="bg-surface shadow-lg border-primary/10 h-[600px] flex flex-col" data-testid="card-coaching">
            <CardHeader className="border-b border-primary/10 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-primary">Coaching Session</CardTitle>
                    <p className="text-sm text-secondary">I have full context of your situation. How can I help?</p>
                  </div>
                </div>
                {coachingMessages.length > 1 && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleDownloadCoaching}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      data-testid="button-download-coaching"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Export Chat
                    </Button>
                    <Button
                      onClick={handleDownloadSession}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      data-testid="button-download-all"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Export All
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 p-6 flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4" data-testid="chat-messages">
                {coachingMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                    data-testid={`message-${message.role}-${index}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`rounded-lg p-4 max-w-[80%] ${
                        message.role === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-accent/10 text-primary'
                      }`}
                    >
                      <p className="leading-relaxed">{message.content}</p>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">U</span>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    </div>
                    <div className="bg-accent/10 rounded-lg p-4">
                      <p className="text-primary">Thinking...</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Chat Input */}
              <div className="border-t border-primary/10 pt-4">
                <div className="flex space-x-3">
                  <Textarea
                    value={coachingInput}
                    onChange={(e) => setCoachingInput(e.target.value)}
                    placeholder="Ask me anything about your situation..."
                    onKeyPress={(e) => handleKeyPress(e, handleCoachingSubmit)}
                    className="flex-1 resize-none border-primary/20 focus:border-primary/40"
                    rows={2}
                    data-testid="textarea-coaching"
                  />
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={() => setIsVoiceModalOpen(true)}
                      variant="outline"
                      className="p-3 border-accent/30 hover:bg-accent/10"
                      data-testid="button-voice"
                    >
                      <Mic className="w-5 h-5 text-accent" />
                    </Button>
                    <Button
                      onClick={handleCoachingSubmit}
                      disabled={!coachingInput.trim() || isLoading}
                      className="bg-gradient-to-r from-accent to-primary text-white p-3"
                      data-testid="button-send"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Voice Modal for Coaching */}
        <VoiceModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          onSendMessage={handleVoiceMessage}
          isProcessing={isLoading}
          lastResponse={lastCoachResponse}
        />

        {/* Voice Modal for Initial Problem Input */}
        <VoiceModal
          isOpen={isInitialVoiceModalOpen}
          onClose={() => setIsInitialVoiceModalOpen(false)}
          onSendMessage={handleInitialVoiceMessage}
          isProcessing={isLoading}
          lastResponse=""
        />
      </main>
    </div>
  );
}
