import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mic, MicOff, Volume2, VolumeX, Square, Play } from "lucide-react";

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

// Extend Window interface for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  lastResponse?: string;
}

export function VoiceModal({ isOpen, onClose, onSendMessage, isProcessing, lastResponse }: VoiceModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setError('Speech recognition not supported in this browser');
    }

    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Speak response when it arrives
  useEffect(() => {
    if (lastResponse && speechEnabled && synthRef.current) {
      speakText(lastResponse);
    }
  }, [lastResponse, speechEnabled]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setError(null);
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if (synthRef.current && speechEnabled) {
      synthRef.current.cancel(); // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const sendTranscript = () => {
    if (transcript.trim()) {
      onSendMessage(transcript);
      setTranscript('');
    }
  };

  const toggleSpeech = () => {
    setSpeechEnabled(!speechEnabled);
    if (isSpeaking) {
      stopSpeaking();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mic className="w-5 h-5" />
            <span>Voice Coaching</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Voice Controls */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={!recognitionRef.current || isProcessing}
              className={`w-16 h-16 rounded-full ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-primary hover:bg-primary/90'
              }`}
              data-testid="button-voice-toggle"
            >
              {isListening ? (
                <MicOff className="w-6 h-6 text-white" />
              ) : (
                <Mic className="w-6 h-6 text-white" />
              )}
            </Button>

            <Button
              onClick={toggleSpeech}
              variant="outline"
              className="w-16 h-16 rounded-full"
              data-testid="button-speech-toggle"
            >
              {speechEnabled ? (
                <Volume2 className="w-6 h-6" />
              ) : (
                <VolumeX className="w-6 h-6" />
              )}
            </Button>

            {isSpeaking && (
              <Button
                onClick={stopSpeaking}
                variant="outline"
                className="w-16 h-16 rounded-full bg-orange-50 border-orange-200"
                data-testid="button-stop-speaking"
              >
                <Square className="w-6 h-6 text-orange-600" />
              </Button>
            )}
          </div>

          {/* Status */}
          <div className="text-center">
            {isListening && (
              <p className="text-sm text-primary font-medium">
                🎤 Listening... speak now
              </p>
            )}
            {isProcessing && (
              <p className="text-sm text-secondary">
                🤔 Coach is thinking...
              </p>
            )}
            {isSpeaking && (
              <p className="text-sm text-accent font-medium">
                🔊 Coach is speaking...
              </p>
            )}
            {!isListening && !isProcessing && !isSpeaking && (
              <p className="text-sm text-secondary">
                Press microphone to start talking
              </p>
            )}
          </div>

          {/* Transcript */}
          {transcript && (
            <div className="space-y-3">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm font-medium text-primary mb-2">You said:</p>
                <p className="text-primary">{transcript}</p>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={sendTranscript}
                  disabled={isProcessing}
                  className="flex-1"
                  data-testid="button-send-transcript"
                >
                  Send to Coach
                </Button>
                <Button
                  onClick={() => setTranscript('')}
                  variant="outline"
                  data-testid="button-clear-transcript"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="text-xs text-secondary space-y-1 bg-accent/5 p-3 rounded-lg">
            <p>• Hold microphone button and speak your question or thoughts</p>
            <p>• Release when finished, then send your message</p>
            <p>• Toggle speaker to enable/disable voice responses</p>
            <p>• Works best in quiet environments</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}