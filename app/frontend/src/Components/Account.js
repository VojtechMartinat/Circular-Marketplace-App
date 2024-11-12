import React from 'react';
import { useAuth } from '../Contexts/AuthContext'; // Adjust the path as necessary

const Account = () => {
    const { user, isLoggedIn } = useAuth(); // Access user data from context

    if (!isLoggedIn) {
        return <p>You are not logged in. Please log in to view your account details.</p>;
    }

    return (
        <div>
            <h1>Your Account</h1>
            <p>Welcome, {user.username}!</p> {/* Display user's name */}
            <p>Manage your account details and settings here.</p>
        </div>
    );
};

export default Account;
