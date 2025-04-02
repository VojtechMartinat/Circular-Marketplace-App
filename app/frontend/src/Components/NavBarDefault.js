import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import { auth } from '../services/firebaseService';
import { onAuthStateChanged } from 'firebase/auth';
import logo from "./logo.png";



const NavBarDefault = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="logo-title">
                    <img src={logo} alt="ReList Logo" className="logo-img" />
                    <p className="title">ReList</p>
                    <li><Link to="/Background">About Us</Link></li> {/* New link */}
                </Link>
            </div>
            <ul className="navbar-links">
                <li><Link to="/" aria-label="Home">Home</Link></li>
                <li><Link to="/create-article" aria-label="Add Item">Add Item</Link></li>
                <li>
                    {loading ? (
                        <span>Loading...</span>
                    ) : (
                        <Link to={user ? `/profile/${user.uid}` : "/login"} aria-label="Account">
                            {user ? "Account" : "Login"}
                        </Link>
                    )}
                </li>
            </ul>
        </nav>
    );
};





export default NavBarDefault;



