import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';  // Make sure the path is correct

const NavBarDefault = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/create-article">Add Item</Link></li>
                <li><Link to="/account">Account</Link></li>
            </ul>
        </nav>
    );
};

export default NavBarDefault;
