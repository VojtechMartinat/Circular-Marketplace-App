import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticle, getArticlePhotos } from '../services/articleService'; // Adjust the path as neededimport "./article.css";
import './article.css'
import {createOrder} from "../services/orderService";
import {useAuth} from "../Contexts/AuthContext";
import {getUser} from "../services/userService";


    const ArticleDetails = () => {
        const {id} = useParams();
        const navigate = useNavigate();
        const [article, setArticle] = useState(null);
        const [imageUrl, setImageUrl] = useState(null); // State to store image URL
        const [articleUser, setArticleUser] = useState(null)
        const {isLoggedIn, user} = useAuth(); // Access logged-in user data
        useEffect(() => {
            getArticle(id).then(response => {
                if (response) {
                    setArticle(response.article);
                    console.log(response.article)

                }
            });
        }, [id]);
        useEffect(() => {
            if (article && article.userID) {
                getUser(article.userID).then(response => {
                    if (response) {
                        console.log(response.user)
                        setArticleUser(response.user)
                    }
                })
            }
        }, [article]);

        useEffect(() => {
            getArticlePhotos(id).then(response => {
                if (response && response.photos && response.photos[0]) {
                    const imageData = response.photos[0].image.data;
                    const base64data = arrayBufferToBase64(imageData);
                    console.log(base64data);
                    setImageUrl(base64data);
                }
            });
        }, [id]);

        const arrayBufferToBase64 = (array) => {
            let binary = '';
            for (let i = 0; i < array.length; i++) {
                binary += String.fromCharCode(array[i]);
            }
            return 'data:image/png;base64,' + window.btoa(binary);
        };

        const handleBuy = async () => {
            if (!isLoggedIn) {
                alert("Please log in to buy an article");
                return;
            }
            const orderData = {
                userID: user.userID,
                paymentMethodID: "4d530d77-217e-4a89-952e-f4cee8e3fe5c",
                dateOfPurchase: new Date().toISOString(),
                collectionMethod: "collection",
                articles: [
                    {articleID: id}
                ]
            };
            createOrder(orderData)
                .then((res) => {
                    alert(`Order created succesfully!`)
                })
                .catch((error) => {
                    alert(`Error: ${error}`)
                })
        };

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
                    <img src={imageUrl} alt="Article"/>
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
                        <p className="seller-name">{articleUser?.username} </p>
                        <p className="seller-rating">
                            {articleUser?.rating ? `${articleUser.rating} (0 reviews)` : "★★★★★ (0 reviews)"} {/* make the rating display correct rating} */}
                        </p>
                    </div>
                    <div className="seller-location">📍{articleUser?.location}</div>
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
                    <button onClick={handleBuy}>Buy</button>
                </div>
            </div>
        );
    };

export default ArticleDetails;
