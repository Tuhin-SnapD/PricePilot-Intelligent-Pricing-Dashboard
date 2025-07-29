import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { FiX, FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    // Validation
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    
    try {
      console.log("Attempting login for:", username);
      await login(username, password);
      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Login error:", err);
      let errorMessage = "Login failed";
      
      if (err.response) {
        // Server responded with error
        const data = err.response.data;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.non_field_errors) {
          errorMessage = data.non_field_errors.join(', ');
        } else if (data.username) {
          errorMessage = `Username: ${data.username.join(', ')}`;
        } else if (data.password) {
          errorMessage = `Password: ${data.password.join(', ')}`;
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
      } else if (err.request) {
        // Network error
        errorMessage = "Network error. Please check your connection.";
      } else {
        // Other error
        errorMessage = err.message || "Login failed";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center px-4 z-50">
      <div className="relative bg-gray-900 rounded-lg shadow-xl w-full max-w-md p-6">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Username *</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 p-3 rounded text-sm">
              <p className="font-medium">Login Error:</p>
              <p>{error}</p>
            </div>
          )}

          {message && (
            <div className="bg-green-900 border border-green-700 text-green-200 p-3 rounded text-sm">
              <p>{message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-teal-700 text-black font-medium py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="text-center text-gray-400 text-sm mt-4">
            <p className="mb-2">
              Don't have an account?{" "}
              <Link to="/register" className="text-teal-400 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
