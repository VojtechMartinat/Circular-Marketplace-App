import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import { auth } from '../services/firebaseService';
import { onAuthStateChanged } from 'firebase/auth';


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

            <div className="nav-container">
                <div className="nav-left">
                    <Link to="/" className="brand">ReList</Link>
                </div>
                <ul className="nav-right">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/create-article">Add Item</Link></li>
                    {user ? (
                        <>
               <li>
                    <Link to={user ? `/profile/${user.uid}` : "/login"}>
                        {user ? "Account" : "Login"}
                    </Link>
                </li>
                    )}
                </ul>
            </div>

        </nav>
    );
};

export default NavBarDefault;


