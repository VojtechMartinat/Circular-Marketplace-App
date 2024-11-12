import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext.js';

const NavBarDefault = () => {
    const { isLoggedIn } = useAuth();

    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/create-article">Add Item</Link></li>
                <li>
                    <Link to={isLoggedIn ? "/account" : "/login"}>
                        {isLoggedIn ? "Account" : "Login"}
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBarDefault;
