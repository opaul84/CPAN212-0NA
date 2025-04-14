import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, login, logout, register } = useAuth();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      setShowAuthForm(false);
      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                db8z
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/create"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              Start Debate
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowAuthForm(!showAuthForm)}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
                >
                  {isLogin ? 'Login' : 'Register'}
                </button>

                {showAuthForm && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg p-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                      )}
                      
                      {!isLogin && (
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      )}
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                      >
                        {isLogin ? 'Login' : 'Register'}
                      </button>
                      
                      <button
                        type="button"
                        onClick={toggleForm}
                        className="w-full text-sm text-gray-400 hover:text-gray-300"
                      >
                        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 