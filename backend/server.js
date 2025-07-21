const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Static files
app.use("/uploads", express.static("uploads"));

// API Routes
app.use('/api/user', require('./routes/userRoute'));
app.use('/api/projects', require('./routes/projectRoute'));
app.use('/api/group', require('./routes/groupRoute'));
app.use('/api/messages', require('./routes/messageRoute'));

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.IO events
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`User joined group room: ${groupId}`);
  });

  socket.on("sendMessage", (messageData) => {
    const { groupId, message } = messageData;
    io.to(groupId).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
