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
import imageRoutes from './routes/images.js';
import { handleSocketConnection } from './socket/socketHandler.js';

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/messages', messageRouter);
app.use('/api/debates', debateRoutes);
app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  handleSocketConnection(io, socket);
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 