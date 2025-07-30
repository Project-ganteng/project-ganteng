import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRoom } from '../context/RoomContext';
import { useToast } from '../context/ToastContext';
import RoomCard from '../components/RoomCard';
import CreateRoomModal from '../components/CreateRoomModal';
import { roomAPI } from '../utils/api';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('my-rooms');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user, logout } = useAuth();
  const { rooms, userRooms, loading, fetchRooms, fetchUserRooms } = useRoom();
  const { success, error } = useToast();

  const testAPI = async () => {
    try {
      console.log('Testing API connection...');
      const response = await roomAPI.getAllRooms();
      console.log('API Test successful:', response);
      success('API connection working!');
    } catch (err) {
      console.error('API Test failed:', err);
      error('API connection failed: ' + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchUserRooms();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-to-r from-indigo-500/5 to-cyan-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center animate-glow">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                MeetingSummarizer
              </h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-lg rounded-2xl px-4 py-2 border border-white/20">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg animate-glow">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="text-white font-medium text-sm">{user?.email?.split('@')[0]}</span>
                  <p className="text-gray-300 text-xs">Online</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20"
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fadeInUp">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl p-8 text-white shadow-2xl border border-white/10 hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.01]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                  Welcome back, {user?.email?.split('@')[0] || 'User'}! 👋
                </h2>
                <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                  Ready to start meaningful conversations? Create or join a room to unlock the power of AI-driven collaboration.
                </p>
                <div className="flex flex-wrap gap-6 text-sm text-blue-100">
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 hover:bg-white/15 transition-all duration-200">
                    <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Real-time chat</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 hover:bg-white/15 transition-all duration-200">
                    <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>AI summaries</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 hover:bg-white/15 transition-all duration-200">
                    <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Active users tracking</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full flex items-center justify-center animate-glow">
                  <svg className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
          <div className="flex space-x-1 bg-white/10 backdrop-blur-lg rounded-2xl p-1 border border-white/20">
            <button
              onClick={() => handleTabChange('my-rooms')}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'my-rooms'
                  ? 'bg-white/20 text-white shadow-xl backdrop-blur-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              My Rooms ({userRooms.length})
            </button>
            <button
              onClick={() => handleTabChange('all-rooms')}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'all-rooms'
                  ? 'bg-white/20 text-white shadow-xl backdrop-blur-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Discover Rooms ({rooms.length})
            </button>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={testAPI}
              className="bg-white/10 backdrop-blur-lg text-white px-4 py-3 rounded-xl hover:bg-white/20 font-medium flex items-center space-x-2 transition-all duration-200 hover:scale-105 border border-white/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Test API</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 font-medium flex items-center space-x-2 shadow-2xl transition-all duration-200 hover:scale-105 transform animate-glow"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create New Room</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                <span className="text-white font-medium">Loading your rooms...</span>
              </div>
            </div>
          </div>
        )}

        {/* Room Grid */}
        {!loading && (
          <div className="animate-fadeInUp" style={{animationDelay: '0.6s'}}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTab === 'my-rooms' && (
                <>
                  {userRooms.length > 0 ? (
                    userRooms.map((room, index) => (
                      <div key={room.id} className="animate-fadeInUp" style={{animationDelay: `${0.1 * index}s`}}>
                        <RoomCard room={room} isUserRoom={true} />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full">
                      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-glow">
                          <svg className="w-10 h-10 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No rooms yet</h3>
                        <p className="text-gray-300 mb-6">Create your first room to start collaborating with your team</p>
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 font-medium inline-flex items-center space-x-2 shadow-xl transition-all duration-200 hover:scale-105 transform"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span>Create Room</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'all-rooms' && (
                <>
                  {rooms.length > 0 ? (
                    rooms.map((room, index) => (
                      <div key={room.id} className="animate-fadeInUp" style={{animationDelay: `${0.1 * index}s`}}>
                        <RoomCard room={room} isUserRoom={false} />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full">
                      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-glow">
                          <svg className="w-10 h-10 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No public rooms available</h3>
                        <p className="text-gray-300 mb-6">Be the first to create a public room for others to discover</p>
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 font-medium inline-flex items-center space-x-2 shadow-xl transition-all duration-200 hover:scale-105 transform"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span>Create Public Room</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default Dashboard;
