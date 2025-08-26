import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, MessageCircle, Calendar, Search, Download, Mail, Copy, Eye, ArrowLeft } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { format } from "date-fns";
import type { ConversationThread } from "@shared/schema";

export default function ConversationHistory() {
  const { user } = useAuth() as { user: any };
  const { toast } = useToast();
  const [conversations, setConversations] = useState<ConversationThread[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<ConversationThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<ConversationThread | null>(null);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    // Filter conversations based on search term
    const filtered = conversations.filter(conv => 
      conv.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (conv.summary?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
    setFilteredConversations(filtered);
  }, [conversations, searchTerm]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest('GET', '/api/conversations');
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversation history",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadConversation = (conversation: ConversationThread) => {
    const questions = JSON.parse(conversation.questions || '[]');
    const coachingMessages = JSON.parse(conversation.coachingMessages || '[]');
    
    let content = `SOCRATIC THINKING SESSION\n`;
    content += `Generated: ${format(new Date(conversation.createdAt || new Date()), 'PPP')}\n\n`;
    content += `PROBLEM:\n${conversation.problem}\n\n`;
    
    if (questions.length > 0) {
      content += `SOCRATIC DIALOGUE:\n`;
      questions.forEach((q: any, index: number) => {
        content += `Q${index + 1}: ${q.question}\n`;
        content += `A${index + 1}: ${q.answer}\n\n`;
      });
    }
    
    if (conversation.summary) {
      content += `INSIGHTS & SUMMARY:\n${conversation.summary}\n\n`;
    }
    
    if (conversation.actionPlan) {
      content += `ACTION PLAN:\n${conversation.actionPlan}\n\n`;
    }
    
    if (coachingMessages.length > 0) {
      content += `COACHING CONVERSATION:\n`;
      coachingMessages.forEach((msg: any) => {
        content += `${msg.role.toUpperCase()}: ${msg.content}\n\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thinking-session-${format(new Date(conversation.createdAt || new Date()), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Conversation downloaded successfully"
    });
  };

  const copyConversation = (conversation: ConversationThread) => {
    const questions = JSON.parse(conversation.questions || '[]');
    
    let content = `Problem: ${conversation.problem}\n\n`;
    
    if (questions.length > 0) {
      content += `Key Questions & Insights:\n`;
      questions.forEach((q: any, index: number) => {
        content += `${index + 1}. ${q.question}\n   → ${q.answer}\n\n`;
      });
    }
    
    if (conversation.summary) {
      content += `Summary: ${conversation.summary}\n\n`;
    }
    
    if (conversation.actionPlan) {
      content += `Action Plan: ${conversation.actionPlan}`;
    }

    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Copied",
        description: "Conversation copied to clipboard"
      });
    });
  };

  const emailConversation = async (conversation: ConversationThread) => {
    try {
      const questions = JSON.parse(conversation.questions || '[]');
      
      let content = `I wanted to share insights from my recent thinking session:\n\n`;
      content += `**Problem I worked through:**\n${conversation.problem}\n\n`;
      
      if (conversation.summary) {
        content += `**Key Insights:**\n${conversation.summary}\n\n`;
      }
      
      if (conversation.actionPlan) {
        content += `**My Action Plan:**\n${conversation.actionPlan}\n\n`;
      }
      
      content += `Generated through Socratic coaching on ${format(new Date(conversation.createdAt || new Date()), 'PPP')}`;

      const response = await apiRequest('POST', '/api/email/send', {
        subject: `Thinking Session Insights - ${format(new Date(conversation.createdAt || new Date()), 'PP')}`,
        content: content,
        conversationId: conversation.id
      });

      const data = await response.json();
      
      if (response.ok) {
        // Copy the email content to clipboard for easy sharing
        await navigator.clipboard.writeText(data.emailContent);
        
        toast({
          title: "Email Content Ready",
          description: "Email content copied to clipboard! You can paste it into any email client to share your insights."
        });
      } else {
        throw new Error(data.error || 'Failed to prepare email');
      }
    } catch (error) {
      console.error('Error preparing email:', error);
      toast({
        title: "Email Preparation Failed",
        description: "Could not prepare email content. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (selectedConversation) {
    const questions = JSON.parse(selectedConversation.questions || '[]');
    const coachingMessages = JSON.parse(selectedConversation.coachingMessages || '[]');

    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-primary/10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setSelectedConversation(null)}
              className="text-secondary hover:text-primary"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to History
            </Button>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyConversation(selectedConversation)}
                data-testid="button-copy-conversation"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadConversation(selectedConversation)}
                data-testid="button-download-conversation"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => emailConversation(selectedConversation)}
                data-testid="button-email-conversation"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary mb-2">Thinking Session Details</h1>
            <p className="text-secondary">
              {format(new Date(selectedConversation.createdAt || new Date()), 'PPPP')}
            </p>
          </div>

          {/* Problem */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Original Problem</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-secondary leading-relaxed">{selectedConversation.problem}</p>
            </CardContent>
          </Card>

          {/* Questions & Answers */}
          {questions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Socratic Dialogue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {questions.map((q: any, index: number) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-accent font-semibold text-sm">Q</span>
                      </div>
                      <p className="text-primary font-medium">{q.question}</p>
                    </div>
                    <div className="flex items-start space-x-3 ml-11">
                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-semibold text-sm">A</span>
                      </div>
                      <p className="text-secondary">{q.answer}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          {selectedConversation.summary && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Insights & Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary leading-relaxed whitespace-pre-wrap">
                  {selectedConversation.summary}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Plan */}
          {selectedConversation.actionPlan && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Action Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary leading-relaxed whitespace-pre-wrap">
                  {selectedConversation.actionPlan}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Coaching Messages */}
          {coachingMessages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Coaching Conversation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {coachingMessages.map((msg: any, index: number) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-primary/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-primary">Conversation History</h1>
            <Badge variant="secondary">{filteredConversations.length} sessions</Badge>
          </div>
          <Link href="/">
            <Button variant="outline" data-testid="button-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary" />
            <Input
              placeholder="Search conversations by problem or insights..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-secondary">Loading your conversation history...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-primary/50" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm ? 'No matching conversations found' : 'No conversations yet'}
            </h3>
            <p className="text-secondary mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Start your first thinking session to see it here'
              }
            </p>
            {!searchTerm && (
              <Link href="/">
                <Button data-testid="button-start-session">
                  Start Your First Session
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredConversations.map((conversation) => {
              const questions = JSON.parse(conversation.questions || '[]');
              const hasContent = conversation.summary || conversation.actionPlan || questions.length > 0;
              
              return (
                <Card 
                  key={conversation.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedConversation(conversation)}
                  data-testid={`card-conversation-${conversation.id}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-primary mb-2 line-clamp-2">
                          {conversation.problem}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-secondary">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(conversation.createdAt || new Date()), 'MMM d, yyyy')}</span>
                          </div>
                          {questions.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{questions.length} questions</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyConversation(conversation);
                          }}
                          className="text-secondary hover:text-primary"
                          data-testid={`button-copy-${conversation.id}`}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadConversation(conversation);
                          }}
                          className="text-secondary hover:text-primary"
                          data-testid={`button-download-${conversation.id}`}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            emailConversation(conversation);
                          }}
                          className="text-secondary hover:text-primary"
                          data-testid={`button-email-${conversation.id}`}
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-secondary hover:text-primary"
                          data-testid={`button-view-${conversation.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {conversation.summary && (
                      <p className="text-secondary text-sm line-clamp-2 mt-2">
                        {conversation.summary}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        {hasContent && (
                          <>
                            {conversation.summary && (
                              <Badge variant="outline" className="text-xs">Summary</Badge>
                            )}
                            {conversation.actionPlan && (
                              <Badge variant="outline" className="text-xs">Action Plan</Badge>
                            )}
                            {questions.length > 0 && (
                              <Badge variant="outline" className="text-xs">{questions.length} Q&A</Badge>
                            )}
                          </>
                        )}
                      </div>
                      <span className="text-xs text-secondary">
                        {format(new Date(conversation.updatedAt || new Date()), 'h:mm a')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}