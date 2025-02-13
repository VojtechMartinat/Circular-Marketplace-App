import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "../services/firebaseService";
import { createUser, getUser } from "../services/userService";
import "./Register.css";

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [location, setLocation] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [googleUser, setGoogleUser] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userData = {
                userID: user.uid,
                username,
                email,
                location,
                wallet: 0,
            };

            await createUser(userData);
            alert("Registration successful! Please log in.");
            navigate("/login");
        } catch (error) {
            console.error("Registration failed:", error);
            alert("Registration failed. Please try again.");
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            try {
                await getUser(user.uid);
                alert("Google Sign-In successful!");
                navigate("/");
            } catch (error) {
                setGoogleUser(user);
                setShowModal(true);
            }
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

        const userData = {
            userID: googleUser.uid,
            username,
            email: googleUser.email,
            location,
            wallet: 0,
        };

        await createUser(userData);
        setShowModal(false);
        navigate("/");
    };

    return (
        <div className='body'>
            <div className='register-container'>
                <h2 className='register-header'>Register</h2>
                <form onSubmit={handleRegister}>
                    <div>
                        <input
                            type='text'
                            className='input'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder='Username'
                            required
                        />
                    </div>
                    <div>
                        <input
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Password'
                            required
                        />
                    </div>
                    <div>
                        <input
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder='Email'
                        />
                    </div>
                    <div>
                        <input
                            type='text'
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Location"
                            required
                        />
                    </div>
                    <button type='submit'>Register</button>
                </form>

                <hr />

                <button onClick={handleGoogleSignIn} className='google-sign-in-button'>
                    Sign in with Google
                </button>
            </div>

            {/* Full-Screen Modal for New Google Users */}
            {showModal && (
                <div className='modal'>
                    <div className='modal-content'>
                        <h3>Welcome! Let's complete your profile</h3>
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

export default RegisterPage;
