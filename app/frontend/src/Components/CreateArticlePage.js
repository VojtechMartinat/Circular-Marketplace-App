import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle } from '../services/articleService';
import { uploadPhoto } from '../services/photoService'; // Import the uploadPhoto service

const CreateArticlePage = () => {
    const [articleTitle, setArticleTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null); // State for the uploaded image
    const navigate = useNavigate();

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!articleTitle || !description || !price || !image) {
            alert("Please fill in all fields and upload an image.");
            return;
        }

        try {
            // Create article first
            const articleData = {
                articleTitle,
                description,
                price: parseFloat(price),
                dateAdded: new Date(),
                state: 'uploaded',
            };

            const articleResponse = await createArticle(articleData); // Create the article in the DB

            // Upload the photo
            const photoData = new FormData();
            photoData.append('image', image);
            photoData.append('articleID', articleResponse.articleID); // Attach the article ID

            await uploadPhoto(photoData); // Upload the photo and associate with the article

            // Redirect to home or another page
            navigate('/');
        } catch (error) {
            console.error('Error creating article and uploading photo:', error);
            alert('Failed to create article or upload photo');
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
