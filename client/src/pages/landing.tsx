import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, MessageCircle, Brain, FileText, Mic, Download } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Header */}
      <header className="border-b border-primary/10 bg-white/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Socratic Coach
              </h1>
              <p className="text-sm text-secondary">AI-Powered Thinking Partner</p>
            </div>
          </div>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="bg-gradient-to-r from-primary to-accent text-white"
            data-testid="button-login"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Think Deeper, Decide Better
          </h2>
          <p className="text-xl text-secondary max-w-3xl mx-auto mb-8">
            Your personal AI thinking coach that uses the Socratic method to help you work through problems, 
            make better decisions, and gain clarity on complex situations.
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            size="lg"
            className="bg-gradient-to-r from-primary to-accent text-white text-lg px-8 py-4"
            data-testid="button-get-started"
          >
            Get Started Free
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Socratic Questioning</h3>
              <p className="text-secondary">
                AI-powered questions that guide you to discover insights and solutions through your own thinking process.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <Mic className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Voice Interaction</h3>
              <p className="text-secondary">
                Speak your thoughts naturally with voice-to-text and text-to-speech for hands-free coaching sessions.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Document Upload</h3>
              <p className="text-secondary">
                Upload PDFs, Word documents, or text files to extract problems and start coaching sessions instantly.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Personalized Insights</h3>
              <p className="text-secondary">
                Get tailored summaries, action plans, and coaching that adapts to your unique thinking patterns.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Export & Share</h3>
              <p className="text-secondary">
                Download sessions as Word documents, copy insights, or email action plans to keep your progress.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Conversation Memory</h3>
              <p className="text-secondary">
                All your thinking sessions are saved and searchable, building a personal library of insights over time.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold mb-4">Ready to think differently?</h3>
              <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto">
                Join thousands of people using Socratic coaching to make better decisions, 
                solve complex problems, and gain clarity in their personal and professional lives.
              </p>
              <Button 
                onClick={() => window.location.href = '/api/login'}
                size="lg"
                className="bg-gradient-to-r from-primary to-accent text-white text-lg px-8 py-4"
                data-testid="button-start-coaching"
              >
                Start Your First Session
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/10 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-secondary">
          <p>&copy; 2025 Socratic Coach. Powered by AI, designed for human thinking.</p>
        </div>
      </footer>
    </div>
  );
}