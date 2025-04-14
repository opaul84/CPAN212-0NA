import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

const Home = () => {
  const [debates, setDebates] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    // Fetch active debates when component mounts
    fetch('http://localhost:5000/api/debates')
      .then(res => res.json())
      .then(data => setDebates(data))
      .catch(err => console.error('Error fetching debates:', err));

    if (socket) {
      // Listen for new debates
      socket.on('new-debate', (debate) => {
        setDebates(prev => [debate, ...prev]);
      });

      // Listen for debate updates
      socket.on('debate-updated', (updatedDebate) => {
        setDebates(prev => prev.map(d => 
          d._id === updatedDebate._id ? updatedDebate : d
        ));
      });
    }

    return () => {
      if (socket) {
        socket.off('new-debate');
        socket.off('debate-updated');
      }
    };
  }, [socket]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Active Debates
        </h1>
        <Link
          to="/create"
          className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <span>Start a Debate</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {debates.map((debate) => (
          <Link
            key={debate._id}
            to={`/debate/${debate._id}`}
            className="block p-6 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200 border border-gray-700"
          >
            <h2 className="text-xl font-semibold mb-2">{debate.title}</h2>
            <p className="text-gray-400 mb-4">{debate.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{debate.participants.length} participants</span>
              <span>{new Date(debate.createdAt).toLocaleDateString()}</span>
            </div>
          </Link>
        ))}
      </div>

      {debates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No active debates. Be the first to start one!</p>
        </div>
      )}
    </div>
  );
};

export default Home; 