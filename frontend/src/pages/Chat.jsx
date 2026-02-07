import React, { useEffect, useState, useRef } from 'react';
import { chatService } from '../services/chatService';
import { authService } from '../services/authService';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
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

  useEffect(() => {
    if(!currentUser) return;
    
    const loadProjects = async () => {
      const userProjects = await chatService.getMyProjects();
      setProjects(userProjects);

      if(userProjects.length > 0) {
        setSelectedProject(userProjects[0]);
      }
    };

    loadProjects();
  }, [currentUser]);

  // Connect to WebSocket and load message history
  useEffect(() => {
    if (!selectedProject) return;

    // Load message history
    const loadMessages = async () => {
      const history = await chatService.getMessageHistory(selectedProject.id);
      setMessages(history);
    };

    loadMessages();

    // Connect to WebSocket
    chatService.connect(selectedProject.id);

    // Listen for new messages
    const unsubscribe = chatService.onMessage((data) => {
      if (data.type === 'message' && data.project_id === selectedProject.id) {
        setMessages(prev => {
          if (prev.some(m => m.id === data.id)) return prev;
          return [...prev, data];
        });
      }
    });

    // Cleanup
    return () => {
      unsubscribe();
      chatService.disconnect();
    };
  }, [selectedProject]);    

  // FLOW:
  //   Load past messages from database
  //   Connect WebSocket
  //   Listen for new real-time messages
  //   Clean up when component unmounts

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedProject) return;

    chatService.sendMessage(newMessage);
    setNewMessage('');
  };

  const handleProjectChange = (project) => {
    setSelectedProject(project);
    setMessages([]); // Clear old messages
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
    <PageTransition>
    <div className="flex bg-gradient-to-r from-emerald-200 to-emerald-900 h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex p-6 gap-4">
        {/* Project List Sidebar */}
        <div className="w-64 bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-bold text-emerald-900 mb-4">My Projects</h2>
          
          {projects.length === 0 ? (
            <p className="text-gray-500 text-sm">No projects available</p>
          ) : (
            <div className="space-y-2">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleProjectChange(project)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedProject?.id === project.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <p className="font-semibold truncate">{project.title}</p>
                  {project.description && (
                    <p className="text-xs opacity-75 truncate mt-1">
                      {project.description}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Area */}
        {selectedProject ? (
          <div className="flex-1 flex justify-center h-full">
            <div className="w-full max-w-[40vw] bg-white rounded-lg shadow-lg flex flex-col h-full">
              
              {/* Header */}
              <div className="bg-emerald-600 text-white px-6 py-4 rounded-t-lg">
                <h1 className="text-2xl font-bold">{selectedProject.title}</h1>
                <p className="text-sm text-emerald-100">
                  Project Chat • {currentUser.first_name} {currentUser.last_name}
                </p>
              </div>

              {/* Messages */}
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
                              {msg.sender_first_name} {msg.sender_last_name}
                            </p>
                          )}
                          <p className="break-words">{msg.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isOwnMessage ? 'text-emerald-100' : 'text-gray-500'
                            }`}
                          >
                            {new Date(msg.created_at).toLocaleTimeString('en-IN', {
                              timeZone: 'Asia/Kolkata',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
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
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-white rounded-lg shadow-lg flex items-center justify-center">
            <p className="text-gray-500 text-lg">Select a project to start chatting</p>
          </div>
        )}

      </div>
    </div>
    </PageTransition>
  );
};

export default Chat;