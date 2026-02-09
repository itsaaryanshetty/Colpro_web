import React, { useEffect, useState, useRef } from 'react';
import { chatService } from '../services/chatService';
import { authService } from '../services/authService';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { Send, MessageSquare, Hash } from 'lucide-react';

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
    if (!currentUser) return;

    const loadProjects = async () => {
      const userProjects = await chatService.getMyProjects();
      setProjects(userProjects);

      if (userProjects.length > 0) {
        setSelectedProject(userProjects[0]);
      }
    };

    loadProjects();
  }, [currentUser]);

  // Connect toWebSocket and load message history
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
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-xl font-bold text-emerald-400 animate-pulse">Loading chat...</div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <PageTransition>
      <div className="flex bg-slate-950 h-screen overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex p-6 gap-4 pl-0 lg:pl-64 pt-24">
          {/* Project List Sidebar */}
          <div className="w-80 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="text-emerald-400" size={24} />
                My Projects
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {projects.length === 0 ? (
                <div className="text-slate-500 text-center py-10">
                  <p className="text-sm">No projects found</p>
                </div>
              ) : (
                projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleProjectChange(project)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 group border ${selectedProject?.id === project.id
                        ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                        : 'bg-slate-800/50 border-transparent hover:bg-slate-800 hover:border-slate-700'
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <div className={`p-2 rounded-lg ${selectedProject?.id === project.id ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600'}`}>
                        <Hash size={16} />
                      </div>
                      <p className={`font-bold truncate transition-colors ${selectedProject?.id === project.id ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                        {project.title}
                      </p>
                    </div>
                    {project.description && (
                      <p className="text-xs text-slate-500 truncate pl-11 group-hover:text-slate-400">
                        {project.description}
                      </p>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-slate-900/50 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-sm">
            {selectedProject ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex justify-between items-center">
                  <div>
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                      <Hash className="text-emerald-500" size={20} />
                      {selectedProject.title}
                    </h1>
                    <p className="text-xs text-slate-400">
                      Project Chat • {currentUser.first_name} {currentUser.last_name}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-950/30">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                      <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center animate-bounce">
                        <MessageSquare size={32} className="text-emerald-500" />
                      </div>
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
                          <div className={`flex flex-col max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>

                            {!isOwnMessage && (
                              <span className="text-xs text-slate-400 mb-1 ml-1">
                                {msg.sender_first_name} {msg.sender_last_name}
                              </span>
                            )}

                            <div
                              className={`px-5 py-3 rounded-2xl relative shadow-md ${isOwnMessage
                                  ? 'bg-emerald-600 text-white rounded-br-none'
                                  : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                                }`}
                            >
                              <p className="break-words leading-relaxed text-sm md:text-base">{msg.content}</p>
                            </div>

                            <span className="text-[10px] text-slate-500 mt-1 opacity-70 px-1">
                              {new Date(msg.created_at).toLocaleTimeString('en-IN', {
                                timeZone: 'Asia/Kolkata',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-4 bg-slate-900 border-t border-slate-800">
                  <div className="flex gap-3 bg-slate-800/50 p-1.5 rounded-xl border border-slate-700 focus-within:ring-2 focus-within:ring-emerald-500/50 focus-within:border-emerald-500/50 transition-all">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`Message #${selectedProject.title}...`}
                      className="flex-1 bg-transparent px-4 py-2 text-white placeholder:text-slate-500 outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/20"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-4">
                <div className="w-24 h-24 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center">
                  <MessageSquare className="text-slate-700" size={40} />
                </div>
                <p className="text-lg font-medium">Select a project to start chatting</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default Chat;