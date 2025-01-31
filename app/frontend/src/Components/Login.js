// Components/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import './Login.css'
import { loginUser } from '../services/userService';
import {createTaskLog} from "../services/logService";
const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [startTime, setStartTime] = useState(null);
    const [timeTaken, setTimeTaken] = useState(null);

    // Start the timer when the component mounts
    useEffect(() => {
        setStartTime(Date.now());
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const userData = await loginUser(username, password); 
            login(userData);

            // Calculate time taken
            const endTime = Date.now();
            const duration = endTime - startTime;
            setTimeTaken(duration);

            console.log(`Time taken to log in: ${duration} ms`);
            const taskLogData = {
                timeTaken : duration,
                taskID: 1
            }
            await createTaskLog(taskLogData)

            navigate('/'); // Redirect to Home page
        } catch (error) {
            console.error('Login failed:', error);
            alert('Invalid username or password.');
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/register'); 
    };

    return (
        <div className='body'>
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
                {timeTaken !== null && (
                    <p>Time taken to complete login: {timeTaken} ms</p>
                )}
                <p className='login-footer'>Don't have an account? <a href="#" onClick={handleRegisterRedirect}>Register</a></p>
            </div>
        </div>
    );
};

export default LoginPage;
