import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const ChatMessages = ({ roomId }) => {
  const { roomMessages } = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const messages = useMemo(() => roomMessages[roomId] || [], [roomMessages, roomId]);
  
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]); // Only when messages count changes

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = formatDate(message.timestamp || message.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {Object.entries(messageGroups).map(([date, dateMessages]) => (
        <div key={date}>
          {/* Date separator */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500 bg-gray-50">{date}</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Messages for this date */}
          {dateMessages.map((message, index) => {
            const isOwnMessage = message.username === user?.username;
            const isSystemMessage = message.type === 'system';
            const showAvatar = index === 0 || dateMessages[index - 1]?.username !== message.username;
            
            // Create unique key from message ID, timestamp, and index as fallback
            const uniqueKey = message.id || `${message.timestamp || message.createdAt}-${index}-${message.username}-${message.message.substring(0, 10)}`;
            
            // System messages (user joined/left) - should not appear since we filtered them out
            if (isSystemMessage) {
              return (
                <div key={uniqueKey} className="flex justify-center my-2">
                  <div className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs">
                    {message.message}
                  </div>
                </div>
              );
            }
            
            return (
              <div
                key={uniqueKey}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3`}
              >
                <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                  {showAvatar && !isOwnMessage && (
                    <div className="flex items-center mb-1">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium mr-2">
                        {message.username?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {message.username}
                      </span>
                    </div>
                  )}
                  
                  <div
                    className={`px-4 py-2 rounded-lg shadow-sm ${
                      isOwnMessage
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                    <div className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                      {formatTime(message.timestamp || message.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      
      {messages.length === 0 && (
        <div className="text-center text-gray-500 mt-12">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start the conversation</h3>
          <p className="text-gray-500">Send a message to begin this meeting discussion</p>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
