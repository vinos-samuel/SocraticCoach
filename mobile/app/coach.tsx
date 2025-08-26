import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '../lib/api';
import type { Question, Stage } from '../types';

export default function SocraticCoach() {
  const [stage, setStage] = useState<Stage>('initial');
  const [problem, setProblem] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [summary, setSummary] = useState('');
  const [actionPlan, setActionPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const maxQuestions = 6;

  const generateQuestionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/generate-question', {
        problem,
        previousQuestions: questions,
      });
      return response;
    },
    onSuccess: (data: any) => {
      setCurrentQuestion(data.question);
      setStage('questioning');
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to generate question. Please try again.');
      console.error('Question generation error:', error);
    },
  });

  const generateSummaryMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/generate-summary', {
        problem,
        questions,
      });
      return response;
    },
    onSuccess: (data: any) => {
      setSummary(data.summary);
      setStage('summary');
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to generate summary. Please try again.');
      console.error('Summary generation error:', error);
    },
  });

  const generateActionPlanMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/generate-action-plan', {
        problem,
        summary,
      });
      return response;
    },
    onSuccess: (data: any) => {
      setActionPlan(data.actionPlan);
      setStage('actionplan');
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to generate action plan. Please try again.');
      console.error('Action plan generation error:', error);
    },
  });

  const handleStartSession = () => {
    if (!problem.trim()) {
      Alert.alert('Required', 'Please describe your problem or situation first.');
      return;
    }
    generateQuestionMutation.mutate();
  };

  const handleAnswerSubmit = () => {
    if (!currentAnswer.trim()) {
      Alert.alert('Required', 'Please provide an answer before continuing.');
      return;
    }

    const newQuestion: Question = {
      question: currentQuestion,
      answer: currentAnswer,
    };

    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    setCurrentAnswer('');

    if (updatedQuestions.length >= maxQuestions) {
      generateSummaryMutation.mutate();
    } else {
      generateQuestionMutation.mutate();
    }
  };

  const handleGenerateActionPlan = () => {
    generateActionPlanMutation.mutate();
  };

  const resetSession = () => {
    setStage('initial');
    setProblem('');
    setQuestions([]);
    setCurrentQuestion('');
    setCurrentAnswer('');
    setSummary('');
    setActionPlan('');
  };

  const renderProgressBar = () => {
    const progress = (questions.length / maxQuestions) * 100;
    return (
      <View className="mb-6">
        <View className="flex-row justify-between mb-2">
          <Text className="text-sm text-secondary">Question {questions.length} of {maxQuestions}</Text>
          <Text className="text-sm text-secondary">{Math.round(progress)}%</Text>
        </View>
        <View className="h-2 bg-gray-200 rounded-full">
          <View 
            className="h-2 bg-accent rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </View>
      </View>
    );
  };

  const renderInitialStage = () => (
    <View className="flex-1 p-6">
      <View className="items-center mb-8">
        <View className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl items-center justify-center mb-4">
          <Ionicons name="bulb" size={32} color="white" />
        </View>
        <Text className="text-2xl font-bold text-primary text-center mb-2">
          What's on Your Mind?
        </Text>
        <Text className="text-secondary text-center">
          Describe the problem, decision, or situation you'd like to think through
        </Text>
      </View>

      <View className="flex-1">
        <TextInput
          className="border border-gray-300 rounded-lg p-4 text-base h-32 bg-white"
          multiline
          placeholder="Describe your situation..."
          value={problem}
          onChangeText={setProblem}
          textAlignVertical="top"
        />
        
        <TouchableOpacity
          className="bg-gradient-to-r from-primary to-accent mt-6 py-4 rounded-lg"
          onPress={handleStartSession}
          disabled={generateQuestionMutation.isPending || !problem.trim()}
        >
          {generateQuestionMutation.isPending ? (
            <Text className="text-white text-center font-semibold">Starting...</Text>
          ) : (
            <Text className="text-white text-center font-semibold">Begin Thinking Session</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderQuestioningStage = () => (
    <View className="flex-1 p-6">
      {renderProgressBar()}
      
      <View className="items-center mb-6">
        <View className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl items-center justify-center mb-4">
          <Ionicons name="help-circle" size={32} color="white" />
        </View>
        <Text className="text-xl font-bold text-primary text-center">
          Let's Explore This Together
        </Text>
      </View>

      <View className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <Text className="text-lg text-primary font-medium">
          {currentQuestion}
        </Text>
      </View>

      <View className="flex-1">
        <TextInput
          className="border border-gray-300 rounded-lg p-4 text-base h-32 bg-white"
          multiline
          placeholder="Share your thoughts..."
          value={currentAnswer}
          onChangeText={setCurrentAnswer}
          textAlignVertical="top"
        />
        
        <TouchableOpacity
          className="bg-gradient-to-r from-accent to-primary mt-6 py-4 rounded-lg"
          onPress={handleAnswerSubmit}
          disabled={generateQuestionMutation.isPending || !currentAnswer.trim()}
        >
          {generateQuestionMutation.isPending ? (
            <Text className="text-white text-center font-semibold">Processing...</Text>
          ) : (
            <Text className="text-white text-center font-semibold">Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSummaryStage = () => (
    <ScrollView className="flex-1 p-6">
      <View className="items-center mb-6">
        <View className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl items-center justify-center mb-4">
          <Ionicons name="checkmark-circle" size={32} color="white" />
        </View>
        <Text className="text-2xl font-bold text-primary text-center mb-2">
          Insights Discovered
        </Text>
        <Text className="text-secondary text-center">
          Here's what we've learned through your reflection
        </Text>
      </View>

      <View className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <Text className="text-base text-secondary leading-relaxed">
          {summary}
        </Text>
      </View>

      <View className="space-y-3">
        <TouchableOpacity
          className="bg-gradient-to-r from-primary to-secondary py-4 rounded-lg"
          onPress={handleGenerateActionPlan}
          disabled={generateActionPlanMutation.isPending}
        >
          {generateActionPlanMutation.isPending ? (
            <Text className="text-white text-center font-semibold">Creating Plan...</Text>
          ) : (
            <Text className="text-white text-center font-semibold">Create Action Plan</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          className="border-2 border-primary py-4 rounded-lg"
          onPress={resetSession}
        >
          <Text className="text-primary text-center font-semibold">Start New Session</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderActionPlanStage = () => (
    <ScrollView className="flex-1 p-6">
      <View className="items-center mb-6">
        <View className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl items-center justify-center mb-4">
          <Ionicons name="document-text" size={32} color="white" />
        </View>
        <Text className="text-2xl font-bold text-primary text-center mb-2">
          Your Action Plan
        </Text>
        <Text className="text-secondary text-center">
          A structured approach to move forward
        </Text>
      </View>

      <View className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <Text className="text-base text-secondary leading-relaxed">
          {actionPlan}
        </Text>
      </View>

      <TouchableOpacity
        className="border-2 border-primary py-4 rounded-lg"
        onPress={resetSession}
      >
        <Text className="text-primary text-center font-semibold">Start New Session</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View className="bg-white/90 border-b border-primary/10 px-4 py-3">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#3D3D39" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-primary">Coaching Session</Text>
            <TouchableOpacity onPress={() => router.push('/history')}>
              <Ionicons name="time" size={24} color="#3D3D39" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        {stage === 'initial' && renderInitialStage()}
        {stage === 'questioning' && renderQuestioningStage()}
        {stage === 'summary' && renderSummaryStage()}
        {stage === 'actionplan' && renderActionPlanStage()}

        {/* Loading overlay */}
        {(generateSummaryMutation.isPending) && (
          <View className="absolute inset-0 bg-black/50 items-center justify-center">
            <View className="bg-white p-8 rounded-xl items-center">
              <Text className="text-lg font-semibold text-primary mb-2">
                Reflecting on your thoughts...
              </Text>
              <Text className="text-secondary">This may take a moment</Text>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}