import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/api';
import type { Conversation } from '../types';

export default function ConversationHistory() {
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['/api/conversations'],
    queryFn: () => apiRequest<Conversation[]>('GET', '/api/conversations'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/conversations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
    },
    onError: () => {
      Alert.alert('Error', 'Failed to delete conversation. Please try again.');
    },
  });

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      'Delete Conversation',
      `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteMutation.mutate(id)
        },
      ]
    );
  };

  const renderConversationCard = (conversation: Conversation) => {
    const date = new Date(conversation.createdAt).toLocaleDateString();
    const questionCount = conversation.questions?.length || 0;
    
    return (
      <View key={conversation.id} className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
        <View className="p-4">
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1 mr-3">
              <Text className="text-lg font-semibold text-primary mb-1" numberOfLines={2}>
                {conversation.title}
              </Text>
              <Text className="text-sm text-secondary mb-2">
                {date} • {questionCount} questions
              </Text>
              <Text className="text-sm text-secondary" numberOfLines={3}>
                {conversation.problem}
              </Text>
            </View>
            
            <View className="flex-row space-x-2">
              <TouchableOpacity
                className="p-2"
                onPress={() => handleDelete(conversation.id, conversation.title)}
                disabled={deleteMutation.isPending}
              >
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Status and actions */}
          <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
            <View className="flex-row items-center space-x-2">
              <View className={`w-2 h-2 rounded-full ${
                conversation.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              <Text className="text-xs text-secondary capitalize">
                {conversation.status}
              </Text>
            </View>
            
            <View className="flex-row space-x-2">
              {conversation.summary && (
                <TouchableOpacity className="bg-blue-50 px-3 py-1 rounded-full">
                  <Text className="text-xs text-blue-600 font-medium">Summary</Text>
                </TouchableOpacity>
              )}
              {conversation.actionPlan && (
                <TouchableOpacity className="bg-green-50 px-3 py-1 rounded-full">
                  <Text className="text-xs text-green-600 font-medium">Action Plan</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-white/90 border-b border-primary/10 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#3D3D39" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-primary">Conversation History</Text>
          <TouchableOpacity onPress={() => router.push('/coach')}>
            <Ionicons name="add" size={24} color="#3D3D39" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-4">
        {isLoading ? (
          <View className="flex-1 items-center justify-center py-16">
            <Text className="text-secondary mb-2">Loading conversations...</Text>
          </View>
        ) : conversations.length > 0 ? (
          <>
            <View className="mb-6">
              <Text className="text-2xl font-bold text-primary mb-2">
                Your Thinking Journey
              </Text>
              <Text className="text-secondary">
                Review your past coaching sessions and insights
              </Text>
            </View>
            
            {conversations.map(renderConversationCard)}
          </>
        ) : (
          <View className="flex-1 items-center justify-center py-16">
            <View className="w-20 h-20 bg-primary/10 rounded-2xl items-center justify-center mb-4">
              <Ionicons name="document-text-outline" size={40} color="#9B6CDB" />
            </View>
            <Text className="text-xl font-semibold text-primary mb-2 text-center">
              No Conversations Yet
            </Text>
            <Text className="text-secondary text-center mb-6 max-w-sm">
              Start your first thinking session to see your conversation history here.
            </Text>
            <TouchableOpacity
              className="bg-gradient-to-r from-primary to-accent px-8 py-3 rounded-lg"
              onPress={() => router.push('/coach')}
            >
              <Text className="text-white font-semibold">Start First Session</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}