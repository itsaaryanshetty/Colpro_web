// manages chat WebSocket connections and message history

import { authService } from './authService';

const API_BASE_URL = 'http://65.2.107.195:8000';
const WS_BASE_URL = 'ws://65.2.107.195:8000';

class ChatService {
  constructor() {
    this.ws = null;
    this.listeners = [];
    this.currentProjectId = null;
    this.intentionalDisconnect = false;
  }

  connect(projectId = null) {
    const token = authService.getToken();
    
    if (!token) {
      console.error('No token found');
      return;
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;
    
    this.intentionalDisconnect = false;
    this.currentProjectId = projectId;

    // create a websocket connection with the token for authentication9
    this.ws = new WebSocket(`${WS_BASE_URL}/chat/ws/${token}/${projectId}`);

    // when connection opens
    this.ws.onopen = () => {
      console.log('WebSocket connected to project:', projectId);
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
      if (!this.intentionalDisconnect) {
        console.log('Reconnecting WebSocket...');
        setTimeout(() => this.connect(this.currentProjectId), 3000);
      }
    };
  }

  disconnect() {
    
    if (this.ws) {
      this.intentionalDisconnect = true;
      this.ws.close();
      this.ws = null;
    }
  }


  // usage -> chatService.sendMessage("Hello team!", 5);  // Send to project 5
  // chatService.sendMessage("Hi everyone!");    // Send to general chat
  sendMessage(content) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({content}));
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

  async getMessageHistory(projectId, limit = 50) {
    const token = authService.getToken();
    const url = `${API_BASE_URL}/chat/messages/${projectId}?limit=${limit}`;

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

  async getMyProjects() {
    const token = authService.getToken();

    try {
      const response = await fetch(`${API_BASE_URL}/chat/my-projects`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

}

export const chatService = new ChatService();