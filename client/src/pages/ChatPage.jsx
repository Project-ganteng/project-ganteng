import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useRoom } from '../context/RoomContext';
import { useAuth } from '../context/AuthContext';
import ChatMessages from '../components/ChatMessages';
import ChatInput from '../components/ChatInput';
import SummaryPanel from '../components/SummaryPanel';
import { chatAPI } from '../utils/api';

const ChatPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { currentRoom, getRoomDetails } = useRoom();
  const { user } = useAuth();
  const { joinRoom, leaveRoom, connected, activeUsers } = useSocket();
  const [showSummary, setShowSummary] = useState(false);
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomData = async () => {
      setLoading(true);
      try {
        // Get room details
        const result = await getRoomDetails(roomId);
        if (result.success) {
          setRoomDetails(result.room);
        } else {
          navigate('/dashboard');
          return;
        }

        // Get existing messages
        try {
          const messagesResponse = await chatAPI.getRoomMessages(roomId);
          // Messages will be handled by socket context
        } catch (error) {
          console.error('Failed to fetch messages:', error);
        }

        // Join the room via socket (wait for connection)
        if (connected) {
          joinRoom(roomId);
        } else {
          console.log('⏳ Waiting for socket connection before joining room...');
          // Will be handled by the useEffect below
        }
      } catch (error) {
        console.error('Failed to fetch room details:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchRoomData();
    }

    // Cleanup: leave room when component unmounts
    return () => {
      if (roomId) {
        leaveRoom(roomId);
      }
    };
  }, [roomId]);

  // Join room when socket is connected
  useEffect(() => {
    if (connected && roomId && roomDetails) {
      console.log('🔌 Socket connected, joining room:', roomId);
      joinRoom(roomId);
    }
  }, [connected, roomId, roomDetails]);

  const handleLeaveRoom = () => {
    leaveRoom(roomId);
    navigate('/dashboard');
  };

  const roomActiveUsersData = activeUsers[roomId] || { users: [], count: 0 };
  const roomActiveUsers = roomActiveUsersData.users || [];
  const activeCount = roomActiveUsersData.count || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl animate-fadeInUp">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-glow">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Loading Room...
            </h2>
            <p className="text-gray-300 mb-6">Getting everything ready for you</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLeaveRoom}
                className="text-gray-300 hover:text-white p-3 hover:bg-white/10 rounded-xl transition-all duration-200 group border border-white/10 hover:border-white/20"
                title="Back to Dashboard"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              
              <div className="border-l border-white/20 h-8"></div>
              
              <div>
                <h1 className="text-xl font-bold text-white flex items-center space-x-3">
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {roomDetails?.name || 'Chat Room'}
                  </span>
                  {roomDetails?.isPrivate && (
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-400/30 backdrop-blur-lg">
                      Private
                    </span>
                  )}
                </h1>
                <div className="flex items-center space-x-6 text-sm text-gray-300 mt-1">
                  <span className={`flex items-center ${connected ? 'text-emerald-400' : 'text-red-400'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></div>
                    {connected ? 'Connected' : 'Disconnected'}
                  </span>
                  <span className="flex items-center text-cyan-300">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM9 7c.693 0 1.355.263 1.843.751.488.488.751 1.15.751 1.843v.812A4.5 4.5 0 019 14.5a4.5 4.5 0 01-2.594-4.094V9.594c0-.693.263-1.355.751-1.843C7.645 7.263 8.307 7 9 7zM2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0010 15c-2.796 0-5.487-.46-8-1.308z"/>
                    </svg>
                    {activeCount} active
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Active Users */}
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-lg rounded-2xl px-4 py-2 border border-white/20">
                <span className="text-sm text-gray-300 font-medium">Active:</span>
                <div className="flex -space-x-2">
                  {roomActiveUsers.slice(0, 3).map((activeUser, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold border-2 border-white/20 shadow-xl animate-glow"
                      title={activeUser}
                      style={{animationDelay: `${index * 0.2}s`}}
                    >
                      {activeUser.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {activeCount > 3 && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white/20 shadow-xl">
                      +{activeCount - 3}
                    </div>
                  )}
                </div>
              </div>

              {/* Summary Toggle */}
              <button
                onClick={() => setShowSummary(!showSummary)}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 backdrop-blur-lg border hover:scale-105 transform ${
                  showSummary
                    ? 'bg-blue-500/20 text-blue-300 border-blue-400/30 shadow-xl animate-glow'
                    : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20 hover:text-white hover:border-white/30'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{showSummary ? 'Hide Summary' : 'AI Summary'}</span>
              </button>

              {/* User Info */}
              <div className="flex items-center space-x-3 pl-4 border-l border-white/20">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-xl animate-glow">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-white font-medium">{user?.username}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Chat Section */}
        <div className="flex-1 flex flex-col bg-black/10 backdrop-blur-sm">
          <ChatMessages roomId={roomId} />
          <ChatInput roomId={roomId} />
        </div>

        {/* Summary Panel */}
        {showSummary && (
          <div className="w-80 bg-white/10 backdrop-blur-xl border-l border-white/10 shadow-2xl">
            <SummaryPanel 
              roomId={roomId} 
              roomName={roomDetails?.name || 'Chat Room'} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
