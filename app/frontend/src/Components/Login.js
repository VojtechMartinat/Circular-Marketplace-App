// Components/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
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
            const userData = await loginUser(username, password); // Fetch user data from server
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
            {timeTaken !== null && (
                <p>Time taken to complete login: {timeTaken} ms</p>
            )}
            <p>Don't have an account?</p>
            <button onClick={handleRegisterRedirect}>Register</button>
        </div>
    );
};

export default LoginPage;
