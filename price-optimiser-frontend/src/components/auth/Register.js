import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { FiX } from 'react-icons/fi';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [role,     setRole]     = useState('buyer');
  const [message,  setMessage]  = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password, role);
      setMessage('Registered! Redirecting…');
      setTimeout(() => navigate('/login'), 1000);
    } catch {
      setMessage('Registration failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center px-4 z-50">
      <div className="relative bg-gray-900 rounded-lg shadow-xl w-full max-w-md p-6">
        {/* Close button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Enter a username"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Choose a password"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <option value="buyer">Buyer</option>
              <option value="supplier">Supplier</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-black font-medium py-2 rounded transition"
          >
            Register
          </button>

          {message && (
            <p className="text-sm text-center text-teal-400 mt-2">
              {message}
            </p>
          )}

          <p className="text-center text-gray-400 text-sm mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-400 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
