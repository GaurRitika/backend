import { useState, useEffect, useRef } from 'react';
import { messageAPI } from '../utils/api';
import { socketManager } from '../utils/socket';

interface Message {
  _id: string;
  sender: { _id: string; name: string; email: string };
  receiver: { _id: string; name: string; email: string };
  content: string;
  messageType: string;
  isRead: boolean;
  createdAt: string;
}

interface Resident {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedResident?: Resident;
}

export default function ChatModal({ isOpen, onClose, selectedResident }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [residents, setResidents] = useState<Resident[]>([]);
  const [selectedResidentId, setSelectedResidentId] = useState<string>('');
  const [conversationId, setConversationId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isOpen) {
      fetchResidents();
      connectSocket();
    }
    return () => {
      socketManager.disconnect();
    };
  }, [isOpen]);

  useEffect(() => {
    if (selectedResident) {
      setSelectedResidentId(selectedResident._id);
      fetchConversation(selectedResident._id);
    }
  }, [selectedResident]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectSocket = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const socket = socketManager.connect(token);
      
      socket.on('receive_message', (data) => {
        if (data.sender === selectedResidentId) {
          setMessages(prev => [...prev, data]);
        }
      });

      socket.on('user_typing', (data) => {
        if (data.userId === selectedResidentId) {
          setTypingUsers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
        }
      });

      socket.on('user_stop_typing', (data) => {
        setTypingUsers(prev => prev.filter(id => id !== data.userId));
      });
    }
  };

  const fetchResidents = async () => {
    try {
      const response = await messageAPI.getResidents();
      setResidents(response);
    } catch (error) {
      console.error('Error fetching residents:', error);
    }
  };

  const fetchConversation = async (residentId: string) => {
    try {
      setLoading(true);
      const conversations = await messageAPI.getConversations();
      const conversation = conversations.find((conv: any) => 
        conv.participants.some((p: any) => p._id === residentId)
      );
      
      if (conversation) {
        setConversationId(conversation._id);
        const messages = await messageAPI.getConversationMessages(conversation._id);
        setMessages(messages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedResidentId) return;

    try {
      const messageData = {
        receiverId: selectedResidentId,
        content: newMessage.trim(),
        messageType: 'text'
      };

      // Send via API
      const response = await messageAPI.sendMessage(messageData);
      
      // Add to local state
      setMessages(prev => [...prev, response]);
      
      // Send via socket for real-time
      socketManager.sendMessage(messageData);
      
      setNewMessage('');
      socketManager.stopTyping(selectedResidentId);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    socketManager.startTyping(selectedResidentId);
    
    typingTimeoutRef.current = setTimeout(() => {
      socketManager.stopTyping(selectedResidentId);
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-semibold">
                {selectedResident ? getInitials(selectedResident.name) : 'C'}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {selectedResident ? selectedResident.name : 'Select a resident to chat'}
              </h3>
              {selectedResident && (
                <p className="text-sm text-gray-500">{selectedResident.email}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Residents List */}
          <div className="w-1/3 border-r bg-gray-50">
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Community Members</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {residents.map((resident) => (
                  <button
                    key={resident._id}
                    onClick={() => {
                      setSelectedResidentId(resident._id);
                      fetchConversation(resident._id);
                    }}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedResidentId === resident._id
                        ? 'bg-indigo-100 border-indigo-300'
                        : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold text-sm">
                          {getInitials(resident.name)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{resident.name}</p>
                        <p className="text-xs text-gray-500">{resident.email}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedResidentId ? (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : (
                    <>
                      {messages.map((message) => (
                        <div
                          key={message._id}
                          className={`flex ${message.sender._id === selectedResidentId ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.sender._id === selectedResidentId
                                ? 'bg-gray-200 text-gray-900'
                                : 'bg-indigo-600 text-white'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender._id === selectedResidentId
                                ? 'text-gray-500'
                                : 'text-indigo-200'
                            }`}>
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {typingUsers.length > 0 && (
                        <div className="flex justify-start">
                          <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                            <p className="text-sm italic">Typing...</p>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTyping();
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          sendMessage();
                        }
                      }}
                      placeholder="Type your message..."
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-gray-500">Select a community member to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}