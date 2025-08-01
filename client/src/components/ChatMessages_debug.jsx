import React, { useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const ChatMessages = ({ roomId }) => {
  const { roomMessages } = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const messages = roomMessages[roomId] || [];
  
  console.log('💬 ChatMessages DEBUG:', { 
    roomId, 
    messages, 
    messagesLength: messages.length,
    roomMessagesKeys: Object.keys(roomMessages),
    fullRoomMessages: roomMessages 
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simple render untuk debug
  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <div className="text-center text-gray-500 mt-8">
          <p>No messages yet. Start the conversation!</p>
          <p className="text-sm">Room ID: {roomId}</p>
          <p className="text-sm">Messages in state: {JSON.stringify(Object.keys(roomMessages))}</p>
        </div>
        <div ref={messagesEndRef} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      <div className="text-xs text-gray-400 mb-4">
        Debug: {messages.length} messages for room {roomId}
      </div>
      {messages.map((message, index) => (
        <div key={message.id || index} className="bg-white p-3 rounded shadow">
          <div className="font-bold text-sm text-blue-600">
            {message.username || 'Unknown'}
          </div>
          <div className="text-gray-800">
            {message.message}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {new Date(message.timestamp || message.createdAt).toLocaleTimeString()}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
