import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle } from '../services/articleService';
import { useAuth } from '../Contexts/AuthContext';

const CreateArticlePage = () => {
    const [articleTitle, setArticleTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const navigate = useNavigate();

    const { isLoggedIn, user } = useAuth();

    useEffect(() => {
        // If not logged in, redirect to login page with a notification
        if (!isLoggedIn) {
            navigate('/login'); // Redirect to login page
        }
    }, [isLoggedIn, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!articleTitle || !description || !price || !user?.userID) {
            alert("Please fill in all fields and make sure you are logged in.");
            return;
        }

        try {
            // Create article first
            const articleData = {
                articleTitle,
                description,
                userID: user.userID,  // Make sure userID is available
                price: parseFloat(price),  // Ensure price is a valid number
                dateAdded: new Date(),  // Ensure dateAdded is set to a valid date
                state: 'uploaded',  // Assuming the state is 'uploaded' when creating
            };

            // Check the article data before sending it to the backend
            console.log("Article data being sent:", articleData);

            const articleResponse = await createArticle(articleData); // Create the article in the DB

            alert('Successfully posted article');
            // Redirect to home or another page after success
            navigate('/');
        } catch (error) {
            console.error('Error creating article:', error);
            alert('Failed to create article');
        }
    };


    return (
        <div>
            <h1>Create New Article</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Article Title:</label>
                    <input
                        type="text"
                        value={articleTitle}
                        onChange={(e) => setArticleTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>Price:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                <button type="submit">Create Article</button>
            </form>
        </div>
    );
};

export default CreateArticlePage;
