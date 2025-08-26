import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Landing() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white/90 border-b border-primary/10 px-4 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center space-x-3">
              <View className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl items-center justify-center">
                <Text className="text-white font-bold text-lg">S</Text>
              </View>
              <View>
                <Text className="text-xl font-bold text-primary">
                  Socratic Coach
                </Text>
                <Text className="text-sm text-secondary">AI-Powered Thinking Partner</Text>
              </View>
            </View>
            <TouchableOpacity 
              className="bg-gradient-to-r from-primary to-accent px-6 py-3 rounded-lg"
              onPress={() => router.push('/coach')}
            >
              <Text className="text-white font-semibold">Start</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Section */}
        <View className="px-4 py-16">
          <View className="items-center mb-16">
            <View className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl items-center justify-center mb-6">
              <Ionicons name="brain" size={40} color="white" />
            </View>
            <Text className="text-4xl font-bold mb-6 text-center text-primary">
              Think Deeper, Decide Better
            </Text>
            <Text className="text-xl text-secondary text-center max-w-sm mb-8">
              Your personal AI thinking coach that uses the Socratic method to help you work through problems.
            </Text>
            <TouchableOpacity 
              className="bg-gradient-to-r from-primary to-accent px-8 py-4 rounded-lg"
              onPress={() => router.push('/coach')}
            >
              <Text className="text-white text-lg font-semibold">Get Started Free</Text>
            </TouchableOpacity>
          </View>

          {/* Features Grid */}
          <View className="space-y-6">
            <FeatureCard
              icon="help-circle"
              title="Socratic Questioning"
              description="AI guides you through thoughtful questions to explore your problem from all angles."
            />
            <FeatureCard
              icon="mic"
              title="Voice Interaction"
              description="Speak naturally with your AI coach for a more conversational experience."
            />
            <FeatureCard
              icon="document-text"
              title="Action Plans"
              description="Get concrete, actionable steps based on your insights and discoveries."
            />
            <FeatureCard
              icon="time"
              title="Conversation History"
              description="Review past sessions and track your thinking journey over time."
            />
            <FeatureCard
              icon="share"
              title="Export & Share"
              description="Download summaries or share insights via email with others."
            />
            <FeatureCard
              icon="phone-portrait"
              title="Mobile Optimized"
              description="Think and reflect anywhere with our mobile-first design."
            />
          </View>

          {/* CTA Section */}
          <View className="mt-16 p-8 bg-surface rounded-2xl shadow-lg">
            <Text className="text-2xl font-bold text-center text-primary mb-4">
              Ready to Transform Your Thinking?
            </Text>
            <Text className="text-center text-secondary mb-6">
              Join thousands who use Socratic coaching to make better decisions and solve complex problems.
            </Text>
            <TouchableOpacity 
              className="bg-gradient-to-r from-primary to-accent py-4 rounded-lg"
              onPress={() => router.push('/coach')}
            >
              <Text className="text-white text-lg font-semibold text-center">
                Start Your First Session
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface FeatureCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <View className="flex-row items-start space-x-4 p-6 bg-surface rounded-xl shadow-sm">
      <View className="w-12 h-12 bg-accent/10 rounded-xl items-center justify-center">
        <Ionicons name={icon} size={24} color="#9B6CDB" />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-semibold text-primary mb-2">{title}</Text>
        <Text className="text-secondary leading-relaxed">{description}</Text>
      </View>
    </View>
  );
}