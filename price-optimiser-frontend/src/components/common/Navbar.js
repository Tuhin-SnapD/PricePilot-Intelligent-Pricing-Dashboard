import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{ padding: '1rem', background: '#333', color: '#fff' }}>
      <Link to="/" style={{ color: '#fff', marginRight: '1rem' }}>Home</Link>
      {user ? (
        <>
          <Link to="/products" style={{ color: '#fff', marginRight: '1rem' }}>Products</Link>
          <Link to="/forecast" style={{ color: '#fff', marginRight: '1rem' }}>Forecast</Link>
          <Link to="/optimize" style={{ color: '#fff', marginRight: '1rem' }}>Optimize</Link>
          <span style={{ marginRight: '1rem' }}>Welcome, {user.username} ({user.role})</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ color: '#fff', marginRight: '1rem' }}>Login</Link>
          <Link to="/register" style={{ color: '#fff' }}>Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
