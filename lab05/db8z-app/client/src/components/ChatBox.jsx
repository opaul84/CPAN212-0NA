import React, { useState } from "react";
import axios from "axios";

function ChatBox({ roomId, socket }) {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (!message.trim()) return;

    const msgData = {
      roomId,
      userId: "userId_placeholder",  // Replace with actual user ID
      content: message,
    };

    // Emit message via Socket.IO
    socket.emit("send_message", msgData);

    // Save message to MongoDB via the API route
    await axios.post("/api/messages/send", msgData);

    setMessage("");
  };

  return (
    <div className="p-4 flex border-t">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 border rounded-l px-4 py-2 outline-none"
        placeholder="Type your message..."
      />
      <button
        onClick={sendMessage}
        className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
      >
        Send
      </button>
    </div>
  );
}

export default ChatBox;
