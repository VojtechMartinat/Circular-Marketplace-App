import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticle, getArticlePhotos } from '../services/articleService'; // Adjust the path as neededimport "./article.css";
import './article.css'


function App() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [imageUrl, setImageUrl] = useState(null); // State to store image URL
    
    console.log(article)
    useEffect(() => {
        getArticle(id).then(response => {
            if (response) {
                setArticle(response.article);
            }
        });
    }, [id]);

    useEffect(() => {
        getArticlePhotos(id).then(response => {
            console.log("Article photos response:", response);
            if (response && response.photos && response.photos[0]) {
                const photoData = response.photos[0].image.data;

                // Convert the Buffer data to a base64 string using FileReader
                const uint8Array = new Uint8Array(photoData);
                const blob = new Blob([uint8Array], { type: 'image/png' }); // assuming image is PNG
                const reader = new FileReader();

                reader.onloadend = () => {
                    setImageUrl(reader.result); // Base64 URL
                };

                reader.readAsDataURL(blob); // This will trigger the onloadend function
            }
        });
    }, [id]);

    // If article or imageUrl is not available, show loading
    if (!article) return <div>Loading...</div>;


    return (
        <div className="app">
        {/* Header section */}
        <div className="header">
            <button className="back-button" onClick={() => navigate('/')}>←</button>            
            <div className="icons">
            <button className="icon-button">❤</button>
            <button className="icon-button">⇧</button>
            <button className="icon-button">⋮</button>
            </div>
        </div>

        {/* Image placeholder */}
        <div className="image-placeholder">
            <img src={imageUrl} alt = "Article" />
        </div>

        {/* Title and description */}
        <div className="details">
            <h2 className="title">{article.articleTitle}</h2>
            <p className="description">
                {article.description}
            </p>
        </div>

        {/* Seller section */}
        <div className="seller-info">
            <div className="seller-avatar">👤</div>
            <div className="seller-details">
                <p className="seller-name">Name of Seller(placeholder)  </p>
                <p className="seller-rating">★★★★★ (4)</p>
            </div>
            <div className="seller-location">📍 Bristol</div>
        </div>

        {/* Shipping and Collection */}
        <div className="purchase-options">
            <div className="option shipping">
            <p>Shipping</p>
            </div>
            <div className="option collection">
            <p>Collection</p>
            </div>
        </div>

        {/* Purchase Button */}
        <div className="purchase-button">
            <button>Buy for £10 including money-back guarantee</button>
        </div>
        </div>
    );
    }

    export default App;
