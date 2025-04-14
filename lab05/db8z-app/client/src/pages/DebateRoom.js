import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { format } from 'date-fns';

const DebateRoom = () => {
  const { id } = useParams();
  const { socket } = useSocket();
  const { user } = useAuth();
  const [debate, setDebate] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!socket) {
      setError('Chat connection not available');
      return;
    }

    // Socket event listeners
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('join-debate', id);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setError('Failed to connect to chat server');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      setError(error.message);
    });

    // Fetch debate details
    fetch(`http://localhost:5000/api/debates/${id}`)
      .then(res => res.json())
      .then(data => setDebate(data))
      .catch(err => {
        console.error('Error fetching debate:', err);
        setError('Failed to load debate details');
      });

    // Fetch debate messages
    fetch(`http://localhost:5000/api/debates/${id}/messages`)
      .then(res => res.json())
      .then(data => {
        setMessages(data);
        scrollToBottom();
      })
      .catch(err => {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
      });

    // Message handlers
    socket.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    socket.on('debate-updated', (updatedDebate) => {
      setDebate(updatedDebate);
    });

    // Join the debate room
    socket.emit('join-debate', id);

    // Cleanup
    return () => {
      if (socket) {
        socket.emit('leave-debate', id);
        socket.off('connect');
        socket.off('connect_error');
        socket.off('error');
        socket.off('new-message');
        socket.off('debate-updated');
      }
    };
  }, [id, socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please login to participate in the debate');
      return;
    }

    if (newMessage.trim()) {
      socket.emit('send-message', {
        debateId: id,
        content: {
          text: newMessage.trim(),
          format: 'plain'
        }
      });
      setNewMessage('');
    }
  };

  const onEmojiSelect = (emoji) => {
    setNewMessage(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  if (!debate) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      {error && (
        <div className="bg-red-500 text-white p-4 mb-4 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{debate.title}</h1>
        <p className="text-gray-400">{debate.description}</p>
      </div>

      <div className="flex-1 bg-gray-800 rounded-lg p-4 mb-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${message.userId === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.userId === user?.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <img
                    src={message.userId?.avatar || `https://ui-avatars.com/api/?name=${message.userId?.name}`}
                    alt={message.userId?.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-300">
                    {message.userId?.name || 'Anonymous'}
                  </span>
                </div>
                <p className="whitespace-pre-wrap break-words">
                  {message.content.text}
                </p>
                <div className="text-xs text-gray-400 mt-1">
                  {format(new Date(message.createdAt), 'h:mm a')}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            disabled={!user}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default DebateRoom; 