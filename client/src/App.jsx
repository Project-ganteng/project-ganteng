import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RoomProvider } from './context/RoomContext';
import { SocketProvider } from './context/SocketContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/ToastContainer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <RoomProvider>
          <SocketProvider>
            <Router>
              <div className="App">
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected routes */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/chat/:roomId" 
                    element={
                      <ProtectedRoute>
                        <ChatPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Default redirect */}
                  <Route path="/" element={
                    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
                      {/* Animated Background Elements */}
                      <div className="absolute inset-0">
                        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
                        <div className="absolute top-40 right-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
                        <div className="absolute bottom-20 left-40 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
                        <div className="absolute bottom-40 right-40 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '6s'}}></div>
                      </div>

                      {/* Navigation */}
                      <nav className="relative z-10 p-6">
                        <div className="max-w-7xl mx-auto flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                            </div>
                            <span className="text-white text-xl font-bold">MeetingSummarizer</span>
                          </div>
                          <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How it Works</a>
                            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
                            <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Sign In</Link>
                          </div>
                        </div>
                      </nav>

                      {/* Hero Section */}
                      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                        <div className="text-center">
                          <div className="mb-8">
                            <span className="inline-block px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium backdrop-blur-sm border border-blue-500/30">
                              ✨ Powered by Advanced AI Technology
                            </span>
                          </div>
                          
                          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight animate-fadeInUp">
                            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent animate-gradient">
                              Transform Your
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient" style={{animationDelay: '0.5s'}}>
                              Meetings Forever
                            </span>
                          </h1>
                          
                          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                            Experience the future of collaboration with AI-powered summaries, real-time insights, and seamless team communication that actually makes sense.
                          </p>
                          
                          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fadeInUp" style={{animationDelay: '0.6s'}}>
                            <Link 
                              to="/register" 
                              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl animate-glow"
                            >
                              <span className="relative z-10 flex items-center space-x-2">
                                <span>🚀 Start Free Today</span>
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </span>
                            </Link>
                            <Link 
                              to="/login" 
                              className="px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm hover:scale-105"
                            >
                              Sign In
                            </Link>
                          </div>
                          
                          <div className="flex justify-center items-center space-x-8 text-gray-400 text-sm">
                            <div className="flex items-center space-x-2">
                              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span>Free Forever</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span>No Credit Card Required</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span>Setup in 2 Minutes</span>
                            </div>
                          </div>
                        </div>

                        {/* Features Preview */}
                        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="group p-8 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-fadeInUp" style={{animationDelay: '0.9s'}}>
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform animate-glow">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Summaries</h3>
                            <p className="text-gray-300 leading-relaxed">Get intelligent meeting summaries that capture key decisions, action items, and insights automatically.</p>
                          </div>

                          <div className="group p-8 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-fadeInUp" style={{animationDelay: '1.2s'}}>
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform animate-glow" style={{animationDelay: '1s'}}>
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Real-Time Collaboration</h3>
                            <p className="text-gray-300 leading-relaxed">Connect with your team instantly, see who's online, and collaborate seamlessly across any device.</p>
                          </div>

                          <div className="group p-8 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-fadeInUp" style={{animationDelay: '1.5s'}}>
                            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform animate-glow" style={{animationDelay: '2s'}}>
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Lightning Fast</h3>
                            <p className="text-gray-300 leading-relaxed">Experience blazing fast performance with real-time updates and instant synchronization across all platforms.</p>
                          </div>
                        </div>

                        {/* Social Proof */}
                        <div className="mt-20 text-center">
                          <p className="text-gray-400 mb-8">Trusted by teams at</p>
                          <div className="flex justify-center items-center space-x-12 opacity-60">
                            <div className="text-white font-bold text-lg">TechCorp</div>
                            <div className="text-white font-bold text-lg">InnovateCo</div>
                            <div className="text-white font-bold text-lg">FutureTeam</div>
                            <div className="text-white font-bold text-lg">NextGen</div>
                          </div>
                        </div>
                      </div>

                      {/* Floating Action Button */}
                      <div className="fixed bottom-8 right-8 z-50">
                        <Link 
                          to="/register"
                          className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform duration-300"
                        >
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  } />
                  
                  {/* Catch all - redirect to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                
                {/* Toast notifications */}
                <ToastContainer />
              </div>
            </Router>
          </SocketProvider>
        </RoomProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
