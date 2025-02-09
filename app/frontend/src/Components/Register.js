// Components/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../services/userService'; // Adjust path as necessary
import './Register.css'

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
        <div className='body'>
            <div className='register-container'>
            <h2 className='register-header'>Register</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <input
                        type="text"
                        className='input'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='Username'
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Password'
                        required
                    />
                </div>
                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder='Email'
                    />
                </div>
                <div>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder='Location'
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            </div>
        </div>
    );
};

export default RegisterPage;
