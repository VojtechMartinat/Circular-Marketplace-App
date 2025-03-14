import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle } from '../services/articleService';
import { createPhoto } from '../services/photoService';
import './AddItem.css';
import { auth } from '../services/firebaseService';
import { urlGateway } from '../Config/config';
import axios from 'axios';

function AddItem() {
    const [user, setUser] = useState(null);
    const [price, setPrice] = useState('');
    const [isShipping, setIsShipping] = useState(false);
    const [isCollection, setIsCollection] = useState(true);
    const [articleTitle, setArticleTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const maxImages = 5;

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (!currentUser) {
                navigate('/login');
            } else {
                setUser(currentUser);
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleImageChange = (event, index) => {
        const file = event.target.files[0];
        if (file) {
            const newImages = [...images];
            newImages[index] = file;
            setImages(newImages);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!articleTitle || !description || !price || images.length === 0) {
            alert("Please fill in all fields and upload an image.");
            return;
        }

        try {
            const articleData = new FormData();
            const currentDate = new Date().toISOString();
            articleData.append('userID', user.uid);
            articleData.append('articleTitle', articleTitle);
            articleData.append('description', description);
            articleData.append('price', parseFloat(price));
            articleData.append('dateAdded', currentDate);
            articleData.append('state', 'uploaded');
            const shippingType = isShipping ? (isCollection ? "both" : "shipping") : "collection";
            articleData.append('shippingType', shippingType);

            createArticle(articleData).then((res) => {
                for (let i = 0; i < images.length; i++) {
                    const photoData = new FormData();
                    photoData.append('articleID', res.data.article.articleID);
                    photoData.append('image', images[i]);
                    if (!images[i]) {
                        break;
                    }
                    createPhoto(photoData).then(res => {
                    }).catch(err => {
                            throw new Error(err)
                        }
                    )
                }
            }).catch((err) => {
                console.log(err)
                alert("Error creating an article!")
            })

            navigate('/');
        } catch (error) {
            console.error('Error creating article and uploading photo:', error);
            alert('Failed to create article or upload photo');
        }
    };

    const handleAISuggest = async () => {
        if (images.length === 0) {
            alert("Please upload an image first.");
            return;
        }

        setIsLoading(true);

        const file = images[0];
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Image = reader.result.split(',')[1]; // Get base64 part of the image
            try {
                const response = await axios.post(`${urlGateway}` + '/describe', {
                    image: base64Image
                });
                const aiResponse = response.data;
                setDescription(aiResponse.description);
                setArticleTitle(aiResponse.topic);
                setPrice(aiResponse.price);
            } catch (error) {
                console.error('Error calling AI suggest API:', error);
                alert('Failed to get AI suggestion');
            } finally {
                setIsLoading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const renderPhotoBox = (index) => {
        return (
            <div className="photo-box" key={index}>
                {images[index] ? (
                    <img src={URL.createObjectURL(images[index])} alt={`Uploaded ${index}`} className="image-preview" />
                ) : (
                    index === images.length && images.length < maxImages && (
                        <label htmlFor={`image-upload-${index}`} className="upload-label">+</label>
                    )
                )}
                <input
                    type="file"
                    accept="image/*"
                    id={`image-upload-${index}`}
                    onChange={(e) => handleImageChange(e, index)}
                    style={{ display: 'none' }}
                />
            </div>
        );
    };

    return (
        <div className='background'>
            <div className="add-item-container">
                <header className="header">
                    <button className="back-button" onClick={() => navigate('/')}>←</button>
                    <h1>Add Item</h1>
                    <button className="ai-suggest-button" onClick={handleAISuggest} disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'AI-Suggest'}
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="form-container">
                    <div className='input-group'>
                    <label>Add Images</label>
                    <div className="photo-section">
                        {Array.from({ length: maxImages }, (_, index) => renderPhotoBox(index))}
                    </div></div>
                    <div className="input-group">
                        <label>Title</label>
                        <input type="text" value={articleTitle} onChange={(e) => setArticleTitle(e.target.value)} placeholder="Enter title" />
                    </div>
                    <div className="input-group">
                        <label>Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description"></textarea>
                    </div>
                    <div className="input-group">
                        <label>Price (£)</label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter price" />
                    </div>
                    <div className="choice"><label>Choose one or both:</label></div>
                    <div className="shipping-options">
                        <button type="button" className={`option-button ${isShipping ? 'selected' : ''}`} onClick={() => setIsShipping(!isShipping)}>Shipping</button>
                        <button type="button" className={`option-button ${isCollection ? 'selected' : ''}`} onClick={() => setIsCollection(!isCollection)}>Collection</button>
                    </div>
                    <button className="submit-button" type="submit">Publish for £{price ? (parseFloat(price) + 0.2).toFixed(2) : "0.00"}</button>
                </form>
            </div>
        </div>
    );
}

export default AddItem;
