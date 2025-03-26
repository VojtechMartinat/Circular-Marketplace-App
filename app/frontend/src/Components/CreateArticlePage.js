import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle } from '../services/articleService';
import { createPhoto } from '../services/photoService';
import './AddItem.css';
import { auth } from '../services/firebaseService';
import { urlGateway } from '../Config/config';
import axios from 'axios';
import { FaWandMagicSparkles } from "react-icons/fa6";

function AddItem() {
    const [user, setUser] = useState(null);
    const [price, setPrice] = useState('');
    const [isShipping, setIsShipping] = useState(false);
    const [isCollection, setIsCollection] = useState(false);
    const [articleTitle, setArticleTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [animateFields, setAnimateFields] = useState(false); // New state for animation
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

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        if (files) {
            const newImages = [...images];
            files.forEach(file => {
                if (newImages.length < maxImages) {
                    newImages.push(file);
                }
            });
            setImages(newImages);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!articleTitle || !description || !price || images.length === 0) {
            alert("Please fill in all fields and upload an image.");
            return;
        }

        if (!isShipping && !isCollection) {
            alert("Please select a shipping method.");
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
            const base64Image = reader.result.split(',')[1];
            try {
                const response = await axios.post(`${urlGateway}` + '/describe', {
                    image: base64Image
                });
                const aiResponse = response.data;
                setDescription(aiResponse.description);
                setArticleTitle(aiResponse.topic);
                setPrice(aiResponse.price);

                // Trigger animation
                setAnimateFields(true);
                setTimeout(() => {
                    setAnimateFields(false); // Reset animation state after it has run
                }, 500); // Match this duration with your CSS animation duration

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
        const hasImage = images[index]; // Check if there is an image at the current index
        return (
            <div
                className="photo-box"
                key={index}
                style={{
                    border: hasImage ? 'none' : '2px dashed #ccc', // Hide the border if there's an image
                }}
                onClick={() => document.getElementById(`image-upload-${index}`).click()}
            >
                {hasImage ? (
                    <img
                        src={URL.createObjectURL(images[index])}
                        alt={`Uploaded Image ${index}`}
                        className="image-preview"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/path/to/default-image.jpg'; // Optional: Use a fallback image in case of error
                        }}
                    />
                ) : (
                    <label htmlFor={`image-upload-${index}`} className="upload-label">
                        {index === 0 && !hasImage ?
                            <div>
                                <p>+</p>
                                <p>Main Image</p>
                            </div>
                            : "+"}
                    </label>
                )}

                <input
                    type="file"
                    accept="image/*"
                    id={`image-upload-${index}`}
                    onChange={(e) => handleImageChange(e)}
                    style={{ display: 'none' }}
                    multiple
                />
            </div>
        );
    };

    return (
        <div className='background'>
            <div className="add-item-container">
                <div className="article-header-container">
                    <div className="article-header">
                        <h1>Add New Article</h1>
                        <button className="ai-suggest-button" onClick={handleAISuggest} disabled={isLoading}>
                            {isLoading ? <div className="spinner"></div> : <FaWandMagicSparkles/>}
                            {isLoading ? "Loading..." : "Suggest"}
                        </button>
                    </div>
                    <div className="article-subheader">
                        <h2>Create and publish your new listing</h2>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="form-container">
                    <div className='input-group'>
                        <label>Images (1-5)</label>
                        <div className="photo-section">
                            {Array.from({ length: maxImages }, (_, index) => renderPhotoBox(index))}
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={articleTitle}
                            onChange={(e) => {
                                if (e.target.value.length <= 50) {
                                    setArticleTitle(e.target.value);
                                }
                            }}
                            placeholder="Enter article title (50 characters max)"
                            id="article-title-input"
                            className={animateFields ? 'fade-in' : ''}
                        />
                    </div>
                    <div className="input-group">
                        <label>Description</label>
                        <textarea
                            className="description"
                            value={description}
                            onChange={(e) => {
                                if (e.target.value.length <= 255) {
                                    setDescription(e.target.value);
                                }
                            }}
                            placeholder="Enter article description (255 characters max)"
                            id="description-input"
                            className={animateFields ? 'fade-in' : ''}
                            rows="5"
                        />
                    </div>
                    <div className="input-group">
                        <label>Price (£)</label>
                        <input
                            type="number"
                            className='price'
                            value={price}
                            onChange={(e) => {
                                const inputValue = e.target.value;

                                // Allow empty value (for clearing input with delete or backspace)
                                if (inputValue === "" || /^\d+(\.\d{0,2})?$/.test(inputValue)) {
                                    setPrice(inputValue);
                                }
                            }}
                            placeholder="Free"
                            id="price-input"
                            step="1"
                            className={animateFields ? 'fade-in' : ''}
                        />

                    </div>

                    <div className="input-group shipping-method">
                        <label>Shipping Method</label>
                        <div
                            className={`shipping-option ${isCollection ? 'selected' : ''}`}
                            onClick={() => setIsCollection(!isCollection)}
                        >
                            <input
                                type="checkbox"
                                checked={isCollection}
                                onChange={() => {
                                }}
                            />
                            <span>Collection</span>
                        </div>
                        <div
                            className={`shipping-option ${isShipping ? 'selected' : ''}`}
                            onClick={() => setIsShipping(!isShipping)}
                        >
                            <input
                                type="checkbox"
                                checked={isShipping}
                                onChange={() => { }}
                            />
                            <span>Shipping</span>
                        </div>
                    </div>
                    <div className="separator"></div>
                    <div className="total-and-publish">
                        {price ?
                            <span className="total-price">You will receive £{(parseFloat(price) * 0.95).toFixed(2)}</span>
                            :
                            <span className="total-price">Free</span>
                        }
                        <button className="publish-button" type="submit">Publish Article</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddItem;