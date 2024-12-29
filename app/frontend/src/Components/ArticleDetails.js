import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMultiCarousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { getArticle, getArticlePhotos } from '../services/articleService';
import { createOrder } from '../services/orderService';
import { useAuth } from '../Contexts/AuthContext';
import { getUser } from '../services/userService';
import './article.css';

const ArticleDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [photos, setPhotos] = useState([]); // State for multiple photos
    const [articleUser, setArticleUser] = useState(null);
    const { isLoggedIn, user } = useAuth();

    const KebabMenu = () => {
        const [isOpen, setIsOpen] = useState(false);

        const toggleMenu = () => {
            setIsOpen(!isOpen);
        };

        const handleSharing = () => {
            const currentUrl = window.location.href
            navigator.clipboard.writeText(currentUrl)
                .then(() => {alert('Article copied to the clipboard!')})
                .catch((error) => {
                    console.error('Error copying text: ',error)
                })
            setIsOpen(false);
        };

        return (
            <div className="icons">
                <button className="kebab-button" onClick={toggleMenu}>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </button>
                {isOpen && (
                    <div className="menu">
                        <div className="menu-item" onClick={() => handleSharing()}>Share</div>
                    </div>
                )}
            </div>
        );
    };

    useEffect(() => {
        getArticle(id).then((response) => {
            if (response) {
                setArticle(response.article);
            }
        });
    }, [id]);

    useEffect(() => {
        if (article && article.userID) {
            getUser(article.userID).then((response) => {
                if (response) {
                    setArticleUser(response.user);
                }
            });
        }
    }, [article]);

    useEffect(() => {
        getArticlePhotos(id).then((response) => {
            if (response && response.photos) {
                const images = response.photos.map((photo) => {
                    const imageData = arrayBufferToBase64(photo.image.data);
                    return imageData;
                });
                setPhotos(images);
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
            alert('Please log in to buy an article');
            return;
        }
        const orderData = {
            userID: user.userID,
            paymentMethodID: '4d530d77-217e-4a89-952e-f4cee8e3fe5c',
            dateOfPurchase: new Date().toISOString(),
            collectionMethod: 'collection',
            articles: [{ articleID: id }],
        };
        createOrder(orderData)
            .then(() => {
                alert('Order created successfully!');
            })
            .catch((error) => {
                alert(`Error: ${error}`);
            });
    };

    // If article or photos are not available, show loading
    if (!article || photos.length === 0) return <div>Loading...</div>;

    // Carousel settings
    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: Math.min(photos.length, 3),
            slidesToSlide: 1,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: Math.min(photos.length, 2),
            slidesToSlide: 1,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1,
        },
    };

    return (
        <div className="app">
            {/* Header section */}
            <div className="header">
                <button className="back-button" onClick={() => navigate('/')}>
                    ←
                </button>
                <KebabMenu />
            </div>

            {/* Carousel for images */}
            <div className="carousel-container">
                <ReactMultiCarousel responsive={responsive} infinite autoPlay autoPlaySpeed={3000}>
                    {photos.map((photo, index) => (
                        <div key={index} className="carousel-image">
                            <img src={photo} alt={`Article ${index}`} />
                        </div>
                    ))}
                </ReactMultiCarousel>
            </div>

            {/* Title and description */}
            <div className="details">
                <h2 className="title">{article.articleTitle}</h2>
                <p className="description">{article.description}</p>
            </div>

            {/* Seller section */}
            <div className="seller-info">
                <div className="seller-avatar">👤</div>
                <div className="seller-details">
                    <p className="seller-name">{articleUser?.username}</p>
                    <p className="seller-rating">
                        {articleUser?.rating
                            ? `${articleUser.rating} (0 reviews)`
                            : '★★★★★ (0 reviews)'}
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