import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { roomAPI } from '../utils/api';

const RoomContext = createContext();

const roomReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ROOMS':
      return { ...state, rooms: action.payload, loading: false };
    case 'SET_USER_ROOMS':
      return { ...state, userRooms: action.payload };
    case 'SET_CURRENT_ROOM':
      return { ...state, currentRoom: action.payload };
    case 'ADD_ROOM':
      return { 
        ...state, 
        rooms: [...state.rooms, action.payload],
        userRooms: [...state.userRooms, action.payload]
      };
    case 'UPDATE_ROOM':
      return {
        ...state,
        rooms: state.rooms.map(room => 
          room.id === action.payload.id ? action.payload : room
        ),
        userRooms: state.userRooms.map(room => 
          room.id === action.payload.id ? action.payload : room
        ),
      };
    case 'REMOVE_ROOM':
      return {
        ...state,
        rooms: state.rooms.filter(room => room.id !== action.payload),
        userRooms: state.userRooms.filter(room => room.id !== action.payload),
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const RoomProvider = ({ children }) => {
  const [state, dispatch] = useReducer(roomReducer, {
    rooms: [],
    userRooms: [],
    currentRoom: null,
    loading: false,
    error: null,
  });

  const fetchRooms = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await roomAPI.getAllRooms();
      dispatch({ type: 'SET_ROOMS', payload: response.data.rooms });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch rooms' });
    }
  };

  const fetchUserRooms = async () => {
    try {
      const response = await roomAPI.getUserRooms();
      dispatch({ type: 'SET_USER_ROOMS', payload: response.data.rooms });
    } catch (error) {
      console.error('Failed to fetch user rooms:', error);
    }
  };

  const createRoom = async (roomData) => {
    try {
      const response = await roomAPI.createRoom(roomData);
      dispatch({ type: 'ADD_ROOM', payload: response.data.room });
      return { success: true, room: response.data.room };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create room';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const joinRoom = async (roomId) => {
    console.log('RoomContext: Attempting to join room', roomId);
    try {
      const response = await roomAPI.joinRoom(roomId);
      console.log('RoomContext: Join room response', response);
      await fetchUserRooms(); // Refresh user rooms
      return { success: true };
    } catch (error) {
      console.error('RoomContext: Join room error', error);
      const errorMessage = error.response?.data?.message || 'Failed to join room';
      return { success: false, error: errorMessage };
    }
  };

  const leaveRoom = async (roomId) => {
    try {
      await roomAPI.leaveRoom(roomId);
      await fetchUserRooms(); // Refresh user rooms
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to leave room';
      return { success: false, error: errorMessage };
    }
  };

  const deleteRoom = async (roomId) => {
    try {
      await roomAPI.deleteRoom(roomId);
      dispatch({ type: 'REMOVE_ROOM', payload: roomId });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete room';
      return { success: false, error: errorMessage };
    }
  };

  const getRoomDetails = async (roomId) => {
    try {
      const response = await roomAPI.getRoomDetails(roomId);
      dispatch({ type: 'SET_CURRENT_ROOM', payload: response.data.room });
      return { success: true, room: response.data.room };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch room details';
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    ...state,
    fetchRooms,
    fetchUserRooms,
    createRoom,
    joinRoom,
    leaveRoom,
    deleteRoom,
    getRoomDetails,
  };

  return (
    <RoomContext.Provider value={value}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};
