import express from "express";
import Message from "../models/Message.js";
import Room from "../models/Room.js";

const messageRouter = express.Router();

// POST message to a room
messageRouter.post("/send", async (req, res) => {
  const { roomId, userId, content } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    const message = new Message({
      roomId,
      userId,
      content,
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save message" });
  }
});

export default messageRouter;
