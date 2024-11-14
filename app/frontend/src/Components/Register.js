// Components/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../services/userService'; // Adjust path as necessary

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');
    const wallet = 0; // New wallet state
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        const userData = {
            username,
            password,
            email,
            location,
            wallet, // Include wallet in the data to send
        };

        console.log(userData);

        try {
            await createUser(userData);
            alert('Registration successful! Please log in.');
            navigate('/login'); // Redirect to login page after successful registration
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
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
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Location:</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;
