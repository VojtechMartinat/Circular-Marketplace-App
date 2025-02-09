import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "../services/firebaseService";
import { createUser, getUser } from "../services/userService";
import "./Login.css";
import "./modal.css";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [username, setUsername] = useState("");
    const [location, setLocation] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            console.log("User logged in:", userCredential.user);
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);
            alert("Invalid email or password.");
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();

        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;

            // Check if user exists in the database
            try {
                await getUser(user.uid);
                navigate("/");
            } catch (error) {
                // Show modal to collect username and location
                setShowModal(true);
            }

            alert("Google Sign-In successful!");
        } catch (error) {
            console.error("Google sign-in failed:", error);
            alert("Google sign-in failed. Please try again.");
        }
    };

    const handleSaveUser = async () => {
        if (!username.trim() || !location.trim()) {
            alert("Please enter both username and location.");
            return;
        }

        const user = auth.currentUser;
        const userData = {
            userID: user.uid,
            username,
            email: user.email,
            location,
            wallet: 0,
        };

        await createUser(userData);
        setShowModal(false);
        navigate("/");
    };

    return (
        <div className='body'>
            <div className='login-container'>
                <h2 className='login-header'>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className='input-group'>
                        <input
                            className='input'
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
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
                    <button type="submit" className="button">
                        Login
                    </button>
                </form>

                {/* Google Login Button */}
                <button onClick={handleGoogleLogin} className="google-login-button">
                    Sign in with Google
                </button>

                <p className="login-footer">
                    Don't have an account?{" "}
                    <a href="#" onClick={() => navigate("/register")}>
                        Register
                    </a>
                </p>
            </div>

            {/* Custom Modal for User Input */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Welcome! Let's set up your profile</h3>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input"
                        />
                        <input
                            type="text"
                            placeholder="Enter your location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="input"
                        />
                        <button onClick={handleSaveUser} className="button">
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
