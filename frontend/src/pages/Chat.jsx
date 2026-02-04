import React, { useEffect, useState, useRef } from 'react';
import { chatService } from '../services/chatService';
import { authService } from '../services/authService';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom(); //like whatsapp does
  }, [messages]);

  // Verify authentication
  useEffect(() => {
    const verifyAccess = async () => {
      const token = authService.getToken();
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await authService.getProtectedData();
        setCurrentUser(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Authentication failed:', error);
        authService.logout();
        navigate('/login');
      }
    };

    verifyAccess();
  }, [navigate]);

  // Connect to WebSocket and load message history
  useEffect(() => {
    if (!currentUser) return;

    // Load message history
    const loadMessages = async () => {
      const history = await chatService.getMessageHistory();
      setMessages(history);
    };

    loadMessages();

    // Connect to WebSocket
    chatService.connect();

    // Listen for new messages
    const unsubscribe = chatService.onMessage((data) => {
      if (data.type === 'message') {
        setMessages(prev => [...prev, data]);
      }
    });

    // Cleanup
    return () => {
      unsubscribe();
      chatService.disconnect();
    };
  }, [currentUser]);    

  // FLOW:
  //   Load past messages from database
  //   Connect WebSocket
  //   Listen for new real-time messages
  //   Clean up when component unmounts

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    chatService.sendMessage(newMessage);
    setNewMessage('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-emerald-200 to-emerald-900">
        <div className="text-2xl font-bold text-white">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex bg-gradient-to-r from-emerald-200 to-emerald-900 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6">
        <div className="bg-white rounded-lg shadow-lg flex flex-col h-[calc(100vh-3rem)]">
          {/* Header */}
          <div className="bg-emerald-600 text-white px-6 py-4 rounded-t-lg">
            <h1 className="text-2xl font-bold">Team Chat</h1>
            <p className="text-sm text-emerald-100">Connected as {currentUser.first_name} {currentUser.last_name}</p>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isOwnMessage = msg.sender_id === currentUser.id;
                
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-3 rounded-lg ${
                        isOwnMessage
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {!isOwnMessage && (
                        <p className="text-xs font-semibold mb-1 opacity-75">
                          {msg.sender_name}
                        </p>
                      )}
                      <p className="break-words">{msg.content}</p>
                      <p className={`text-xs mt-1 ${isOwnMessage ? 'text-emerald-100' : 'text-gray-500'}`}>
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-900 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;