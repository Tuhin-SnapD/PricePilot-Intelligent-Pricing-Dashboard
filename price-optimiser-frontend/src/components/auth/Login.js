import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      setMessage('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setMessage('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl p-8 max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Username:</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded" />
        </div>
        <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition">Login</button>
        {message && <p className="text-sm text-center text-blue-700 mt-3">{message}</p>}
      </form>
    </div>
  );
};

export default Login;
