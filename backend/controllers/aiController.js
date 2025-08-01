const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// In-memory storage for room messages (you can replace with database)
let roomMessages = {};

// Function to get messages from global storage (used by index.js)
const getRoomMessages = () => roomMessages;
const setRoomMessages = (messages) => { roomMessages = messages; };

module.exports = {
  getRoomMessages,
  setRoomMessages,
  
  async summarizeChat(req, res) {
    try {
      const { roomId, chats } = req.body;

      // If roomId provided, get messages from room storage
      let messagesToSummarize = chats;
      if (roomId && !chats) {
        messagesToSummarize = roomMessages[roomId] || [];
      }

      if (!Array.isArray(messagesToSummarize) || messagesToSummarize.length === 0) {
        return res.status(400).json({ 
          message: "No messages found to summarize",
          roomId: roomId 
        });
      }

      // Create a better prompt for meeting summarization
      const chatText = messagesToSummarize
        .map(msg => `[${new Date(msg.timestamp).toLocaleTimeString()}] ${msg.username}: ${msg.message}`)
        .join("\n");

      const prompt = `
Analyze this meeting/chat conversation and create a comprehensive summary in Indonesian:

=== CHAT LOG ===
${chatText}

=== INSTRUCTIONS ===
Please provide a meeting summary with the following structure:

🎯 **RINGKASAN UTAMA**
- 3-4 bullet points of main topics discussed

📋 **KEPUTUSAN & ACTION ITEMS**  
- Key decisions made
- Action items and who's responsible

👥 **PARTISIPAN AKTIF**
- Who participated most actively

⏰ **WAKTU & DURASI**
- Meeting duration and key timestamps

🔍 **HIGHLIGHTS**
- Important quotes or insights
- Next steps if mentioned

Keep it concise but comprehensive. Use Indonesian language.
      `;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const summary = response.text();

      res.json({ 
        success: true,
        summary,
        roomId,
        messageCount: messagesToSummarize.length,
        generatedAt: new Date().toISOString()
      });

      // Emit summary to room participants
      if (roomId && req.io) {
        req.io.to(roomId).emit("summaryGenerated", {
          roomId,
          summary,
          generatedBy: req.user?.username || 'System',
          timestamp: new Date().toISOString()
        });
      }

    } catch (err) {
      console.error("💥 AI ERROR:", err);
      res.status(500).json({ 
        success: false,
        message: "Failed to generate AI summary", 
        error: err.message 
      });
    }
  }
};
