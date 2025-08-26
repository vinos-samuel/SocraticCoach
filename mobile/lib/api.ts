// API client for React Native app
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your actual Replit deployment URL
// Example: 'https://socratic-coach-username.replit.app'
const API_BASE_URL = __DEV__ ? 'http://localhost:5000' : 'https://your-actual-replit-url.replit.app';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      headers?: Record<string, string>;
      body?: any;
    } = {}
  ): Promise<T> {
    const { method = 'GET', headers = {}, body } = options;
    
    // Get auth token from storage if available
    const token = await AsyncStorage.getItem('auth_token');
    
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Auth methods
  async login(credentials: { email: string; password: string }) {
    const response = await this.request<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: credentials,
    });
    
    // Store auth token
    await AsyncStorage.setItem('auth_token', response.token);
    return response;
  }

  async logout() {
    await AsyncStorage.removeItem('auth_token');
    return this.request('/api/auth/logout', { method: 'POST' });
  }

  async getCurrentUser() {
    return this.request<any>('/api/auth/user');
  }

  // Conversation methods
  async getConversations() {
    return this.request<any[]>('/api/conversations');
  }

  async createConversation(data: any) {
    return this.request<any>('/api/conversations', {
      method: 'POST',
      body: data,
    });
  }

  async updateConversation(id: string, data: any) {
    return this.request<any>(`/api/conversations/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteConversation(id: string) {
    return this.request(`/api/conversations/${id}`, {
      method: 'DELETE',
    });
  }

  // AI methods
  async generateQuestion(problem: string, previousQuestions: any[] = []) {
    return this.request<{ question: string }>('/api/generate-question', {
      method: 'POST',
      body: { problem, previousQuestions },
    });
  }

  async generateSummary(problem: string, questions: any[]) {
    return this.request<{ summary: string }>('/api/generate-summary', {
      method: 'POST',
      body: { problem, questions },
    });
  }

  async generateActionPlan(problem: string, summary: string) {
    return this.request<{ actionPlan: string }>('/api/generate-action-plan', {
      method: 'POST',
      body: { problem, summary },
    });
  }

  async sendCoachingMessage(message: string, context: any) {
    return this.request<{ response: string }>('/api/coaching-chat', {
      method: 'POST',
      body: { message, context },
    });
  }

  // Email methods
  async sendEmail(data: { subject: string; content: string }) {
    return this.request<{ emailContent: string }>('/api/email/send', {
      method: 'POST',
      body: data,
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// React Query helper functions
export const apiRequest = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  body?: any
): Promise<T> => {
  return apiClient.request<T>(endpoint, { method, body });
};