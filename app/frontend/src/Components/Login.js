// Components/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { loginUser } from '../services/userService'; // Adjust path as necessary
import './Login.css'

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const userData = await loginUser(username, password); 
            login(userData);

            navigate('/'); 
        } catch (error) {
            console.error('Login failed:', error);
            alert('Invalid username or password.');
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/register'); 
    };

    return (
        <div className='login-container'>
            <h2 className='login-header'>Login</h2>
            <form onSubmit={handleLogin}>
                <div className='input-group'>
                    <input
                        className='input'
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='Username'
                        required
                    />
                </div>
                <div className='input-group'>
                    <input
                        className='input'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Password'
                        required
                    />
                </div>
                <button type="submit" className='button'>Login</button>
            </form>
            <p className='login-footer'>Don't have an account? <a href="#" onClick={handleRegisterRedirect}>Register</a></p>
        </div>
    );
};

export default LoginPage;
