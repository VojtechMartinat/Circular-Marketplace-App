import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMultiCarousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { getArticle, getArticlePhotos } from '../services/articleService';
import { createOrder } from '../services/orderService';
import { useAuth } from '../Contexts/AuthContext';
import {getUser, getUserRating, getUserReviews} from '../services/userService';
import './article.css';
import {FaWallet} from "react-icons/fa";
import {FaGear} from "react-icons/fa6";
import {auth} from "../services/firebaseService";
const ArticleDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [photos, setPhotos] = useState([]); // State for multiple photos
    const [articleUser, setArticleUser] = useState(null);
    const [user, setUser] = useState(null);
    const [dbUser, setDbUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isShipping, setIsShipping] = useState(false);
    const [isCollection, setIsCollection] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [backgroundGradient, setBackgroundGradient] = useState('linear-gradient(180deg, #f8f8f8, #e0e0e0)');
    const [rating, setRating] = useState(null);
    const [reviewAmount, setReviewAmount] = useState(null);
    const [reviews, setReviews] = useState(null);
    const [showReviews, setShowReviews] = useState(false);
    const [reviewUser, setReviewUser] = useState(null);


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setIsLoggedIn(true);
            } else {
                setUser(null);
                setIsLoggedIn(false);
            }
        });

        return () => unsubscribe();
    }, []);
    useEffect(() => {
        if (user) {
            getUser(user.uid).then((response) => {
                if (response) {
                    setDbUser(response.user);
                }
            });
        }
    }, [user]);


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
                <div className="top-items">
                    <div className="dropdown">
                        <h2 style={{
                            display: "flex",
                            alignItems: "center",
                            textAlign: "left",
                            paddingLeft: 5,
                            gap: 10 // Adjust the gap as needed
                        }}>
                            <FaWallet size={30} style={{color: "black"}}/>
                            {dbUser?.wallet}£
                        </h2>
                    </div>
                    <div className="dropdown">
                        <FaGear size={30} onClick={toggleMenu} style={{color: 'black'}}/>
                    </div>
                </div>

                {isOpen && (
                    <div className="menu">
                        <div className="menu-item" onClick={handleSharing}>Share</div>
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
        if (reviews && Array.isArray(reviews)) {
            reviews.forEach((review) => {
                if (review && review.reviewer) {
                    getUser(review.reviewer).then((response) => {
                        if (response) {
                            setReviewUser(response.user);
                        }
                    });
                }
            });
        }
    }, [reviews]);

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

    useEffect(() => {
        if (article && article.userID) {
            getUserRating(article.userID).then((response) => {
                if (response) {
                    setRating(response.averageRating);
                    setReviewAmount(response.amount);
                }
            });
        }
        console.log(rating)
    }, [article]);

    const StarRating = ({ rating, totalStars = 5 }) => {
        return (
            <div style={{ display: "flex", gap: "2px" }}>
                {Array.from({ length: totalStars }, (_, index) => {
                    const fillPercentage = Math.max(0, Math.min(1, rating - index)); // 1 for full, 0.5 for half, etc.
                    return (
                        <span key={index} style={{ position: "relative", fontSize: "20px" }}>
                        <span style={{ color: "gray" }}>★</span> {/* Background star */}
                            <span
                                style={{
                                    color: "gold",
                                    position: "absolute",
                                    left: 0,
                                    width: `${fillPercentage * 100}%`, // Dynamic width
                                    overflow: "hidden",
                                    display: "inline-block",
                                }}
                            >
                            ★
                        </span> {/* Foreground star (partially filled) */}
                    </span>
                    );
                })}
            </div>
        );
    };

    const handleShowReviews = () => {
        if (articleUser?.userID) {
            getUserReviews(articleUser.userID)
                .then((response) => {
                    if (response) {
                        setReviews(response.reviews || []);
                        setShowReviews(true);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching reviews:", error);
                });
        }
    };
    const ReviewModal = ({onClose}) => {
        return (
            <div className="review-modal-overlay" onClick={onClose}>
            <div className="review-modal-content">
                <h2>Reviews for {articleUser?.username}</h2>
                <ul className="reviews">
                    {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <li key={index}>
                                <span><strong>{reviewUser?.username}</strong>: {review.comment}</span>
                                <div className="star-rating-container">
                                    <StarRating rating={review.rating}/>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>No reviews yet.</p>
                    )}
                </ul>
                <button onClick={onClose} className="close-modal">Close</button>
            </div>
            </div>
        );
    };



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

        if (dbUser.userID === article.userID) {
            alert('You cannot buy your own article');
            return;
        }

        const totalPrice = isShipping ? article.price + 2 : article.price;
        if (dbUser.wallet < totalPrice) {
            alert('You do not have enough money to buy this article');
            return;
        }

        let collectionMethod = '';
        if (isShipping) {
            collectionMethod = 'delivery';
        } else if (isCollection) {
            collectionMethod = 'collection';
        } else {
            alert('Please select a collection method');
            return;
        }

        const orderData = {
            userID: user.uid,
            paymentMethodID: '4d530d77-217e-4a89-952e-f4cee8e3fe5c',
            dateOfPurchase: new Date().toISOString(),
            collectionMethod: collectionMethod,
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

    if (!article || photos.length === 0) return <div>Loading...</div>;

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: Math.min(photos.length, 1),
            slidesToSlide: 1,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: Math.min(photos.length, 1),
            slidesToSlide: 1,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1,
        },
    };

    const CustomLeftArrow = ({ onClick }) => (
        <button onClick={onClick} className="custom-arrow left-arrow">←</button>
      );
      
      const CustomRightArrow = ({ onClick }) => (
        <button onClick={onClick} className="custom-arrow right-arrow">→</button>
      );

    return (
        <div className="app" >
            {/* Header section */}
            <div className="header">
                <button className="back-button" onClick={() => navigate('/')}>
                ← 
                </button>

                <KebabMenu/>
            </div>

            {/* Carousel for images */}
            <div className="carousel-container">
                <ReactMultiCarousel responsive={responsive} 
                infinite 
                autoPlay 
                autoPlaySpeed={10000}
                CustomLeftArrow={<CustomLeftArrow/>}
                CustomRightArrow={<CustomRightArrow/>}>
                    {photos.map((photo, index) => (
                        <div key={index} className="carousel-image">
                            <img src={photo} alt={`Article ${index}`}/>
                        </div>
                    ))}
                </ReactMultiCarousel>
            </div>
            

            {/* Title and description */}
            <div className='info'>
                <h1 className="title" >{article.articleTitle}</h1>
                <h2 className="price">£{article.price}</h2>
                <p className="description">{article.description}</p>
                

            </div>

            {/* Seller section */}
            <div className="seller-info">
                <div className="seller-avatar">👤</div>
                <div className="seller-details">
                    <p className="seller-name">{articleUser?.username}</p>
                    <div className="seller-rating">
                        {rating
                            ? <>
                                <StarRating rating={rating}/> {reviewAmount} reviews
                            </>
                            : 'no reviews yet'}
                    </div>

                    <button onClick={handleShowReviews} className="show-reviews-btn">
                        Show Reviews
                    </button>
                </div>
                <div className="seller-location">📍{articleUser?.location}</div>


            </div>
            {showReviews && <ReviewModal onClose={() => setShowReviews(false)} />}

            <p className='textchoose'>Choose one or both:</p>

            {/* Shipping and Collection */}
            <div className="purchase-options">
                {article.shippingType === 'shipping' || article.shippingType === 'both' ? (
                    <button
                        type="button"
                        className={`option-button ${isShipping ? 'selected' : ''}`}
                        onClick={() => {
                            setIsShipping(!isShipping);
                            if (!isShipping) setIsCollection(false);
                        }}>
                        <p>Shipping</p>
                    </button>
                ) : null}
                {article.shippingType === 'collection' || article.shippingType === 'both' ? (
                    <button
                        type="button"
                        className={`option-button ${isCollection ? 'selected' : ''}`}
                        onClick={() => {
                            setIsCollection(!isCollection);
                            if (!isCollection) setIsShipping(false);
                        }}>
                        <p>Collection</p>
                    </button>
                ) : null}
            </div>

            {/* Purchase Button */}
            <div className="purchase-button">
                <button onClick={handleBuy}>Buy for {isShipping ? article.price + 2 : article.price}</button>

            </div>
            <div className="chat-button">
                <button onClick={() => navigate(`/chat/${article.userID}`)}>Chat with Seller</button>
            </div>


        </div>
    );
};

export default ArticleDetails;