import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { initializeSocket, getSocket, disconnectSocket } from '../utils/socket';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const SocketContext = createContext();

const socketReducer = (state, action) => {
  // Only log important state changes, not every action
  if (['SET_ROOM_MESSAGES', 'ADD_MESSAGE'].includes(action.type)) {
    console.log('🔄 SocketContext:', action.type, action.payload?.roomId);
  }
  
  switch (action.type) {
    case 'SET_CONNECTED':
      return { ...state, connected: action.payload };
    case 'SET_ROOM_MESSAGES':
      // Filter out duplicates based on message ID
      const uniqueMessages = action.payload.messages.filter((msg, index, self) => 
        index === self.findIndex(m => m.id === msg.id)
      );
      if (uniqueMessages.length !== action.payload.messages.length) {
        console.log('📝 Filtered duplicates:', action.payload.messages.length, '→', uniqueMessages.length);
      }
      return { ...state, roomMessages: { ...state.roomMessages, [action.payload.roomId]: uniqueMessages } };
    case 'ADD_MESSAGE':
      const currentMessages = state.roomMessages[action.payload.roomId] || [];
      // Check if message already exists to prevent duplicates
      const messageExists = currentMessages.some(msg => msg.id === action.payload.message.id);
      if (messageExists) {
        console.log('⚠️ Duplicate message skipped:', action.payload.message.id);
        return state;
      }
      return {
        ...state,
        roomMessages: {
          ...state.roomMessages,
          [action.payload.roomId]: [
            ...currentMessages,
            action.payload.message
          ]
        }
      };
    case 'SET_ACTIVE_USERS':
      return { 
        ...state, 
        activeUsers: { 
          ...state.activeUsers, 
          [action.payload.roomId]: {
            users: action.payload.users,
            count: action.payload.count
          }
        } 
      };
    case 'SET_CURRENT_ROOM':
      return { ...state, currentRoom: action.payload };
    case 'SET_SUMMARY':
      return { ...state, lastSummary: action.payload };
    default:
      return state;
  }
};

export const SocketProvider = ({ children }) => {
  const [state, dispatch] = useReducer(socketReducer, {
    connected: false,
    roomMessages: {},
    activeUsers: {},
    currentRoom: null,
    lastSummary: null,
  });

  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('token');
      const socket = initializeSocket(token);

      socket.on('connect', () => {
        dispatch({ type: 'SET_CONNECTED', payload: true });
        console.log('🟢 Connected to server');
        
        // Log all events for debugging
        socket.onAny((event, ...args) => {
          console.log('🔄 Socket event received:', event, args);
        });
      });

      socket.on('disconnect', () => {
        dispatch({ type: 'SET_CONNECTED', payload: false });
        console.log('🔴 Disconnected from server');
      });

      // Listen for existing room messages when joining
      socket.on('roomMessages', (messages) => {
        console.log('📥 Received room messages:', messages);
        console.log('📥 Current room for existing messages:', state.currentRoom);
        if (state.currentRoom && messages.length > 0) {
          dispatch({ 
            type: 'SET_ROOM_MESSAGES', 
            payload: { 
              roomId: state.currentRoom, 
              messages 
            } 
          });
        }
      });

      // Listen for new messages
      socket.on('receiveMessage', (message) => {
        console.log('📨 Received new message:', message);
        console.log('📨 Current room state:', state.currentRoom);
        // Use roomId from the message itself
        const messageRoomId = message.roomId;
        if (messageRoomId) {
          console.log(`📨 Adding message to room ${messageRoomId}`);
          dispatch({ 
            type: 'ADD_MESSAGE', 
            payload: { 
              roomId: messageRoomId, 
              message 
            } 
          });
        } else {
          console.error('❌ Message received without roomId:', message);
        }
      });

      // Listen for user join/leave events
      socket.on('userJoined', (data) => {
        console.log('👥 User joined:', data);
        showToast(`${data.username} joined the room`, 'info');
      });

      socket.on('userLeft', (data) => {
        console.log('👋 User left:', data);
        showToast(`${data.username} left the room`, 'info');
      });

      // Listen for active users updates
      socket.on('activeUsersUpdate', (data) => {
        console.log('📊 Active users updated:', data);
        dispatch({ 
          type: 'SET_ACTIVE_USERS', 
          payload: { 
            roomId: data.roomId, 
            users: data.activeUsers,
            count: data.count
          } 
        });
      });

      // Listen for AI summary generation
      socket.on('summaryGenerated', (data) => {
        dispatch({ type: 'SET_SUMMARY', payload: data });
        console.log('🤖 AI Summary generated:', data);
      });

      return () => {
        disconnectSocket();
      };
    } else {
      disconnectSocket();
      dispatch({ type: 'SET_CONNECTED', payload: false });
    }
  }, [isAuthenticated, user, state.currentRoom]);

  const joinRoom = (roomId) => {
    const socket = getSocket();
    if (socket && socket.connected) {
      const username = user?.email?.split('@')[0] || user?.username || 'Anonymous';
      console.log(`👤 Joining room: ${roomId} as ${username}, socketId: ${socket.id}`);
      console.log(`👤 Socket is connected: ${socket.connected}`);
      console.log(`👤 Current rooms before join:`, socket.rooms);
      
      socket.emit('joinRoom', { roomId, username });
      dispatch({ type: 'SET_CURRENT_ROOM', payload: roomId });
      
      console.log(`👤 Join room event emitted for room ${roomId}`);
    } else {
      console.error('❌ Cannot join room - socket not connected', { 
        socketExists: !!socket, 
        connected: socket?.connected 
      });
      
      // If socket exists but not connected, wait and retry
      if (socket && !socket.connected) {
        console.log('⏳ Waiting for socket to connect, then retrying join room...');
        socket.once('connect', () => {
          console.log('🔄 Socket connected, retrying join room');
          setTimeout(() => joinRoom(roomId), 100);
        });
      }
    }
  };

  const leaveRoom = (roomId) => {
    const socket = getSocket();
    if (socket && socket.connected) {
      const username = user?.email?.split('@')[0] || user?.username || 'Anonymous';
      socket.emit('leaveRoom', { roomId, username });
      dispatch({ type: 'SET_CURRENT_ROOM', payload: null });
      console.log(`👋 Leaving room: ${roomId}`);
    }
  };

  const sendMessage = (roomId, message) => {
    const socket = getSocket();
    if (socket && socket.connected) {
      const username = user?.email?.split('@')[0] || user?.username || 'Anonymous';
      console.log(`💌 Sending message to room ${roomId}:`, { roomId, username, message });
      console.log(`💌 Socket connected: ${socket.connected}, Socket ID: ${socket.id}`);
      console.log(`💌 Socket rooms:`, socket.rooms);
      socket.emit('sendMessage', {
        roomId,
        username,
        message,
      });
      console.log(`💬 Sending message to ${roomId}: ${message}`);
    } else {
      console.error('❌ Cannot send message - socket not connected');
    }
  };

  const value = {
    ...state,
    joinRoom,
    leaveRoom,
    sendMessage,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
