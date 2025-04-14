import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import Message from '../components/Message';
import MessageInput from '../components/MessageInput';

const DebateRoom = () => {
  const { id } = useParams();
  const { socket } = useSocket();
  const { user } = useAuth();
  const [debate, setDebate] = useState(null);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Fetch debate details
    fetch(`http://localhost:5000/api/debates/${id}`)
      .then(res => res.json())
      .then(data => setDebate(data))
      .catch(err => console.error('Error fetching debate:', err));

    // Fetch debate messages
    fetch(`http://localhost:5000/api/debates/${id}/messages`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error('Error fetching messages:', err));

    if (socket) {
      socket.emit('join-debate', id);

      socket.on('new-message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      socket.on('debate-updated', (updatedDebate) => {
        setDebate(updatedDebate);
      });
    }

    return () => {
      if (socket) {
        socket.emit('leave-debate', id);
        socket.off('new-message');
        socket.off('debate-updated');
      }
    };
  }, [id, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (messageData) => {
    if (!user) {
      alert('Please login to participate in the debate');
      return;
    }

    socket.emit('send-message', {
      ...messageData,
      userId: user.id
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Debate Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">{debate?.title}</h1>
        <p className="text-gray-400">{debate?.description}</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <Message
            key={message._id}
            message={message}
            currentUser={user}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        debateId={id}
      />
    </div>
  );
};

export default DebateRoom; 