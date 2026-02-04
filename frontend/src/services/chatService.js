// manages chat WebSocket connections and message history

import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8000';
const WS_BASE_URL = 'ws://localhost:8000';

class ChatService {
  constructor() {
    this.ws = null;
    this.listeners = [];
  }

  connect() {
    const token = authService.getToken();
    
    if (!token) {
      console.error('No token found');
      return;
    }

    // create a websocket connection with the token for authentication9
    this.ws = new WebSocket(`${WS_BASE_URL}/chat/ws/${token}`);

    // when connection opens
    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };

    // when a message is received
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.notifyListeners(data);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // when connection closes
    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Attempt to reconnect after 3 seconds
      setTimeout(() => this.connect(), 3000);
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }


  // usage -> chatService.sendMessage("Hello team!", 5);  // Send to project 5
  // chatService.sendMessage("Hi everyone!");    // Send to general chat
  sendMessage(content, projectId = null) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        content,
        project_id: projectId
      }));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  onMessage(callback) {
    this.listeners.push(callback); 
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners(data) {
    this.listeners.forEach(callback => callback(data));
  }

  async getMessageHistory(projectId = null, limit = 50) {
    const token = authService.getToken();
    const url = projectId 
      ? `${API_BASE_URL}/chat/messages?project_id=${projectId}&limit=${limit}`
      : `${API_BASE_URL}/chat/messages?limit=${limit}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching message history:', error);
      return [];
    }
  }
}

export const chatService = new ChatService();