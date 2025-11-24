import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

function DiscussionForums({ user }) {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const allCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    const uniqueSubjects = [...new Set(allCourses.map(c => c.subject))];
    setSubjects(uniqueSubjects);
    
    if (uniqueSubjects.length > 0 && !selectedSubject) {
      setSelectedSubject(uniqueSubjects[0]);
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (selectedSubject) {
      const allMessages = JSON.parse(localStorage.getItem('forum_messages') || '{}');
      setMessages(allMessages[selectedSubject] || []);
    }
  }, [selectedSubject]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      toast({
        title: "Error",
        description: "Message cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    const message = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    const allMessages = JSON.parse(localStorage.getItem('forum_messages') || '{}');
    if (!allMessages[selectedSubject]) {
      allMessages[selectedSubject] = [];
    }
    allMessages[selectedSubject].push(message);
    localStorage.setItem('forum_messages', JSON.stringify(allMessages));
    
    setMessages(allMessages[selectedSubject]);
    setNewMessage('');
    
    toast({
      title: "Message Sent",
      description: "Your message has been posted to the forum.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 min-h-[600px]">
          <div className="bg-gray-50 border-r border-gray-200 p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Subjects
            </h3>
            
            {subjects.length === 0 ? (
              <p className="text-sm text-gray-500">No subjects available</p>
            ) : (
              <div className="space-y-2">
                {subjects.map(subject => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedSubject === subject
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-3 flex flex-col">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <MessageSquare className="w-6 h-6 mr-2" />
                {selectedSubject || 'Select a Subject'}
              </h2>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map(message => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.userId === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md rounded-lg p-4 ${
                        message.userId === user.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-sm">{message.userName}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          message.userRole === 'teacher'
                            ? message.userId === user.id ? 'bg-blue-500' : 'bg-purple-100 text-purple-800'
                            : message.userId === user.id ? 'bg-blue-500' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {message.userRole === 'teacher' ? 'Teacher' : 'Student'}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.userId === user.id ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  disabled={!selectedSubject}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!selectedSubject || !newMessage.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DiscussionForums;