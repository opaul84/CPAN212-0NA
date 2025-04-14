import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreateDebate = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!user) {
      setError('Please login to create a debate');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/debates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        navigate(`/debate/${data._id}`);
      } else {
        // Handle validation errors
        if (data.details) {
          if (typeof data.details === 'object') {
            // Handle field-specific errors
            const errorMessages = Object.entries(data.details)
              .filter(([_, value]) => value !== null)
              .map(([field, message]) => `${field}: ${message}`)
              .join('\n');
            setError(errorMessages);
          } else {
            // Handle general validation error
            setError(data.details);
          }
        } else {
          setError(data.message || 'Failed to create debate');
        }
      }
    } catch (error) {
      console.error('Error creating debate:', error);
      setError('Failed to create debate. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Start a New Debate
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200 whitespace-pre-line">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            Debate Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors duration-200"
            placeholder="What's your debate topic?"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors duration-200"
            placeholder="Provide some context for your debate..."
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors duration-200"
          >
            <option value="general">General</option>
            <option value="politics">Politics</option>
            <option value="technology">Technology</option>
            <option value="science">Science</option>
            <option value="philosophy">Philosophy</option>
            <option value="society">Society</option>
            <option value="economics">Economics</option>
            <option value="culture">Culture</option>
            <option value="sports">Sports</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          Create Debate
        </button>
      </form>
    </div>
  );
};

export default CreateDebate; 