import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import { auth } from '../services/firebaseService';
import { onAuthStateChanged } from 'firebase/auth';
import logo from "./logo.png";

const NavBarDefault = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    return (
        <nav>
            <div className="navbar-left">
                        <div className="logo-title">
                            <img src={logo} alt="Logo" className="logo-img" />
                            <p className="title">ReList</p>
                        </div>
            </div>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/create-article">Add Item</Link></li>
                <li>
                    <Link to={user ? `/profile/${user.uid}` : "/login"}>
                        {user ? "Account" : "Login"}
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBarDefault;



