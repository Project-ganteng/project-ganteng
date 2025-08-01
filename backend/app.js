require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const aiRoutes = require("./routes/ai");
const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/room");
const { setRoomMessages } = require("./controllers/aiController");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);
app.use("/ai", aiRoutes);

// Store messages per room
let roomMessages = {};
let roomUserSockets = {}; // Track socket connections per room per user

// Keep AI controller in sync with room messages
const updateAIController = () => {
  setRoomMessages(roomMessages);
};

app.get("/", (req, res) => {
  res.send("Socket server OK!");
});

app.get("/chats/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  // Filter out system messages, only return user messages
  const userMessages = (roomMessages[roomId] || []).filter(msg => msg.type === 'user');
  res.json(userMessages);
});

app.get("/chats", (req, res) => {
  res.json(roomMessages);
});

// Get active users count for all rooms (public endpoint)
app.get("/active-users", (req, res) => {
  const activeUsersCount = {};
  for (const roomId in roomUserSockets) {
    activeUsersCount[roomId] = Object.keys(roomUserSockets[roomId]).length;
  }
  res.json(activeUsersCount);
});

// Get active users for specific room (public endpoint)
app.get("/active-users/:roomId", (req, res) => {
  const { roomId } = req.params;
  const activeUsers = roomUserSockets[roomId] ? Object.keys(roomUserSockets[roomId]) : [];
  res.json({
    roomId,
    activeUsers,
    count: activeUsers.length
  });
});

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  // Join room
  socket.on("joinRoom", (data) => {
    console.log(`🎯 Received joinRoom event from socket ${socket.id}:`, data);
    const { roomId, username } = data;
    
    // Initialize room tracking if not exists
    if (!roomUserSockets[roomId]) {
      roomUserSockets[roomId] = {};
    }
    
    // Check if this is the first socket for this user in this room
    const isFirstSocketForUser = !roomUserSockets[roomId][username] || roomUserSockets[roomId][username].length === 0;
    
    // Initialize user socket array if not exists
    if (!roomUserSockets[roomId][username]) {
      roomUserSockets[roomId][username] = [];
    }
    
    // Add this socket to the user's socket list
    roomUserSockets[roomId][username].push(socket.id);
    
    socket.join(roomId);
    socket.roomId = roomId;
    socket.username = username;
    
    console.log(`👤 ${username} joined room: ${roomId} (socket: ${socket.id})`);
    console.log(`🏠 Socket ${socket.id} is now in rooms:`, [...socket.rooms]);
    
    // Send existing messages to new user (only user messages)
    if (roomMessages[roomId]) {
      const userMessages = roomMessages[roomId].filter(msg => msg.type === 'user');
      if (userMessages.length > 0) {
        console.log(`📤 Sending ${userMessages.length} existing user messages to ${username}`);
        socket.emit("roomMessages", userMessages);
      }
    }
    
    // Only notify others if this is the first socket for this user
    if (isFirstSocketForUser) {
      console.log(`📢 Notifying room ${roomId} that ${username} joined`);
      socket.to(roomId).emit("userJoined", {
        username,
        message: `${username} joined the room`,
        createdAt: new Date().toISOString(),
        type: "system"
      });
    }
    
    // Emit updated active users list to all room participants
    const activeUsers = roomUserSockets[roomId] ? Object.keys(roomUserSockets[roomId]) : [];
    io.to(roomId).emit("activeUsersUpdate", {
      roomId,
      activeUsers,
      count: activeUsers.length
    });
    console.log(`📊 Active users in room ${roomId}:`, activeUsers);
  });

  // Send message to room
  socket.on("sendMessage", (data) => {
    const { roomId, username, message } = data;
    
    const messageData = {
      id: Date.now(),
      roomId,
      username,
      message,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      type: "user"
    };

    // Store message
    if (!roomMessages[roomId]) {
      roomMessages[roomId] = [];
    }
    roomMessages[roomId].push(messageData);
    
    // Update AI controller with latest messages
    updateAIController();
    
    // Send to all users in the room
    console.log(`📤 Emitting receiveMessage to room ${roomId}:`, messageData);
    io.to(roomId).emit("receiveMessage", messageData);
    
    console.log(`💬 Message in room ${roomId}: ${username}: ${message}`);
  });

  // Leave room
  socket.on("leaveRoom", (data) => {
    const { roomId, username } = data;
    socket.leave(roomId);
    
    // Remove this socket from user's socket list
    if (roomUserSockets[roomId] && roomUserSockets[roomId][username]) {
      roomUserSockets[roomId][username] = roomUserSockets[roomId][username].filter(id => id !== socket.id);
      
      // If no more sockets for this user, notify others
      if (roomUserSockets[roomId][username].length === 0) {
        console.log(`📢 Notifying room ${roomId} that ${username} left`);
        socket.to(roomId).emit("userLeft", {
          username,
          message: `${username} left the room`,
          createdAt: new Date().toISOString(),
          type: "system"
        });
        
        // Clean up empty user entry
        delete roomUserSockets[roomId][username];
        
        // Emit updated active users list
        const activeUsers = roomUserSockets[roomId] ? Object.keys(roomUserSockets[roomId]) : [];
        io.to(roomId).emit("activeUsersUpdate", {
          roomId,
          activeUsers,
          count: activeUsers.length
        });
        console.log(`📊 Active users in room ${roomId} after leave:`, activeUsers);
      }
    }
    
    console.log(`👋 ${username} left room: ${roomId} (socket: ${socket.id})`);
  });

  socket.on("disconnect", () => {
    if (socket.roomId && socket.username) {
      // Remove this socket from user's socket list
      if (roomUserSockets[socket.roomId] && roomUserSockets[socket.roomId][socket.username]) {
        roomUserSockets[socket.roomId][socket.username] = roomUserSockets[socket.roomId][socket.username].filter(id => id !== socket.id);
        
        // If no more sockets for this user, notify others
        if (roomUserSockets[socket.roomId][socket.username].length === 0) {
          console.log(`📢 Notifying room ${socket.roomId} that ${socket.username} disconnected`);
          socket.to(socket.roomId).emit("userLeft", {
            username: socket.username,
            message: `${socket.username} disconnected`,
            createdAt: new Date().toISOString(),
            type: "system"
          });
          
          // Clean up empty user entry
          delete roomUserSockets[socket.roomId][socket.username];
          
          // Emit updated active users list
          const activeUsers = roomUserSockets[socket.roomId] ? Object.keys(roomUserSockets[socket.roomId]) : [];
          io.to(socket.roomId).emit("activeUsersUpdate", {
            roomId: socket.roomId,
            activeUsers,
            count: activeUsers.length
          });
          console.log(`📊 Active users in room ${socket.roomId} after disconnect:`, activeUsers);
        }
      }
    }
    console.log("🔴 Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
