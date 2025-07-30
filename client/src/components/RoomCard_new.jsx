import React from 'react';
import { useRoom } from '../context/RoomContext';
import { useToast } from '../context/ToastContext';

const RoomCard = ({ room, isUserRoom = false, onJoin, onLeave }) => {
  const { joinRoom, leaveRoom } = useRoom();
  const { success, error } = useToast();

  const handleJoinRoom = async () => {
    console.log('Attempting to join room:', room.id);
    const result = await joinRoom(room.id);
    console.log('Join room result:', result);
    
    if (result.success) {
      success('Successfully joined room!');
      if (onJoin) {
        onJoin(room);
      }
    } else {
      error(result.error || 'Failed to join room');
    }
  };

  const handleLeaveRoom = async () => {
    const result = await leaveRoom(room.id);
    if (result.success) {
      success('Successfully left room!');
      if (onLeave) {
        onLeave(room);
      }
    } else {
      error(result.error || 'Failed to leave room');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-shadow">
            {room.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {room.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              {room.isPrivate ? (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Private
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0v-.5A1.5 1.5 0 0114.5 6c.526 0 .988-.27 1.256-.679a6.012 6.012 0 011.912 2.706A8.963 8.963 0 0110 18a8.963 8.963 0 01-5.668-9.973z" clipRule="evenodd" />
                  </svg>
                  Public
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {room.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {room.description}
        </p>
      )}
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM9 7c.693 0 1.355.263 1.843.751.488.488.751 1.15.751 1.843v.812A4.5 4.5 0 019 14.5a4.5 4.5 0 01-2.594-4.094V9.594c0-.693.263-1.355.751-1.843C7.645 7.263 8.307 7 9 7zM2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0010 15c-2.796 0-5.487-.46-8-1.308z"/>
            </svg>
            <span>{room.memberCount || 0} members</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>Active now</span>
          </div>
        </div>

        {isUserRoom ? (
          <div className="flex space-x-2">
            <button
              onClick={() => window.location.href = `/chat/${room.id}`}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Enter</span>
            </button>
            <button
              onClick={handleLeaveRoom}
              className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Leave</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleJoinRoom}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Join Room</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
