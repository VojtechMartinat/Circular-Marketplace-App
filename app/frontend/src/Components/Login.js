// Components/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { loginUser } from '../services/userService'; // Adjust path as necessary

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const userData = await loginUser(username, password); // Fetch user data from server
            login(userData);

            navigate('/'); // Redirect to Home page
        } catch (error) {
            console.error('Login failed:', error);
            alert('Invalid username or password.');
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/register'); // Redirect to the register page
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account?</p>
            <button onClick={handleRegisterRedirect}>Register</button>
        </div>
    );
};

export default LoginPage;
