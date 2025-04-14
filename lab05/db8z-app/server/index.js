import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import messageRouter from "./routes/messages.js";
import debateRoutes from './routes/debates.js';
import userRoutes from './routes/users.js';
import { handleSocketConnection } from './socket/socketHandler.js';
import jwt from 'jsonwebtoken';

// Load env vars
dotenv.config();

// Create Express app
const app = express();
const httpServer = createServer(app);

// Configure CORS
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Routes
app.use("/api/messages", messageRouter);
app.use('/api/debates', debateRoutes);
app.use('/api/users', userRoutes);

// Simple root route
app.get("/", (req, res) => {
  res.send("Debate server is running 🚀");
});

// Configure Socket.IO
const io = new Server(httpServer, {
  cors: corsOptions,
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000
});

// Socket.IO authentication middleware
io.use(async (socket, next) => {
  try {
    console.log('Socket auth attempt:', socket.id);
    const token = socket.handshake.auth.token;
    
    if (!token) {
      console.log('No token provided for socket:', socket.id);
      return next(new Error('Authentication token required'));
    }

    console.log('Verifying token for socket:', socket.id);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.userId) {
      console.log('No userId in token for socket:', socket.id);
      return next(new Error('Invalid token format'));
    }

    console.log('Socket authenticated:', socket.id, 'userId:', decoded.userId);
    socket.auth = { userId: decoded.userId };
    next();
  } catch (error) {
    console.error('Socket authentication error for socket:', socket.id);
    console.error('Error details:', error.message);
    next(new Error('Invalid token'));
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);
  console.log('Auth data:', socket.auth);
  
  handleSocketConnection(io, socket);
});

// Connect to MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
