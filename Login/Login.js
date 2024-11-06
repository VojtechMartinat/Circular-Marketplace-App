import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-page">
      <h1 className="title">Circular MarketPlace</h1>
      
      <div className="logo">
        <img src="/path-to-your-logo.png" alt="Logo" />
      </div>
      
      <div className="input-group">
        <label htmlFor="username" className="input-label">
          <span role="img" aria-label="user-icon">👤</span>
        </label>
        <input 
          type="text" 
          id="username" 
          placeholder="Username"
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />
      </div>
      
      <div className="input-group">
        <label htmlFor="password" className="input-label">
          <span role="img" aria-label="lock-icon">🔒</span>
        </label>
        <input 
          type={showPassword ? 'text' : 'password'} 
          id="password" 
          placeholder="Password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button 
          type="button" 
          className="toggle-password" 
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>
      
      <div className="options">
        <label>
          <input 
            type="checkbox" 
            checked={rememberMe} 
            onChange={() => setRememberMe(!rememberMe)} 
          />
          Remember Me
        </label>
        <a href="#" className="forgot-password">Forgot Password</a>
      </div>
      
      <button className="login-button">Login</button>
      
      <button className="create-account-button" disabled>Create Account</button>
    </div>
  );
}

export default Login;
