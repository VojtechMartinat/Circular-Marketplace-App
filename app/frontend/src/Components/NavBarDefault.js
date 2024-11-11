import React from 'react';
import { Link } from 'react-router-dom';

const NavBarDefault = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/create-article ">Add Item</Link></li> {
                <li><Link to="/account">Account</Link></li>
                }
            </ul>
        </nav>
    );
};

export default NavBarDefault;
