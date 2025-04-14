import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import io from 'socket.io-client';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { format } from 'date-fns';

const Room = () => {
  const { roomId } = useParams();
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [participants, setParticipants] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const socket = useRef();

  useEffect(() => {
    socket.current = io('http://localhost:5000', {
      auth: {
        token
      }
    });
    
    // Join the debate room
    socket.current.emit('join-debate', roomId);
    
    // Fetch existing messages
    fetch(`http://localhost:5000/api/debates/${roomId}/messages`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error('Error fetching messages:', err));

    // Listen for new messages
    socket.current.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });

    // Listen for participant updates
    socket.current.on('participant-joined', (participant) => {
      setParticipants(prev => [...prev, participant]);
    });

    socket.current.on('participant-left', (userId) => {
      setParticipants(prev => prev.filter(p => p.userId !== userId));
    });

    // Listen for errors
    socket.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    socket.current.on('error', (error) => {
      console.error('Socket error:', error.message);
    });

    return () => {
      socket.current.emit('leave-debate', roomId);
      socket.current.disconnect();
    };
  }, [roomId, token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && user) {
      const messageData = {
        debateId: roomId,
        userId: user.id,
        content: {
          text: message.trim(),
          format: 'plain'
        }
      };
      socket.current.emit('send-message', messageData);
      setMessage('');
    }
  };

  const onEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <div className="h-screen flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-900">
        {/* Room Header */}
        <div className="bg-gray-800 p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">Debate Room: {roomId}</h1>
          <p className="text-sm text-gray-400">{participants.length} participants</p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.userId === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.userId === user?.id ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <img
                    src={msg.userId?.avatar || `https://ui-avatars.com/api/?name=${msg.userId?.name}`}
                    alt={msg.userId?.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-300">
                    {msg.userId?.name}
                  </span>
                </div>
                <p className="text-white whitespace-pre-wrap break-words">
                  {msg.content.text}
                </p>
                <div className="text-xs text-gray-400 mt-1">
                  {format(new Date(msg.createdAt), 'h:mm a')}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-700">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                😊
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2">
                  <Picker
                    data={data}
                    onEmojiSelect={onEmojiSelect}
                    theme="dark"
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Participants Sidebar */}
      <div className="w-64 bg-gray-800 border-l border-gray-700 p-4">
        <h2 className="text-lg font-semibold text-white mb-4">Participants</h2>
        <div className="space-y-2">
          {participants.map((participant) => (
            <div
              key={participant.userId}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700"
            >
              <img
                src={participant.avatar || `https://ui-avatars.com/api/?name=${participant.name}`}
                alt={participant.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-white">{participant.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Room;
