import React, {useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css';
import {getArticle, getArticlePhotos, getPhotosForArticleIds} from '../services/articleService';
import { createOrder } from '../services/orderService';
import {getUser, getUserArticles, getUserRating, getUserReviews} from '../services/userService';
import './article.css';
import { FaLongArrowAltRight } from "react-icons/fa";
import {auth} from "../services/firebaseService";
import SimpleImageViewer from 'react-simple-image-viewer';
import ShippingModal from './ShippingModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import OtherArticlesModal from './OtherArticlesModal';
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from 'axios';

import { GrMapLocation } from "react-icons/gr";
import { RxAvatar } from "react-icons/rx";
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

    const [isOpen, setIsOpen] = useState(false); // To control Lightbox
    const [photoIndex, setPhotoIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [shippingOptions, setShippingOptions] = useState([]);
    const [userArticles, setUserArticles] = useState([]);
    const [isOtherArticleModalOpen, setIsOtherArticleModalOpen] = useState(false);
    const [coordinates, setCoordinates] = useState(null);


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
        if (article && article.userID) {
            getUserArticles(article.userID).then(async (response) => {
                if (response && response.articles) {
                    const articleIds = response.articles.map(article => article.articleID);

                    console.log("Extracted Article IDs:", articleIds);

                    // Check if articleIds is an array and contains values
                    if (Array.isArray(articleIds) && articleIds.length > 0) {
                        try {
                            // Fetch photos for all articles
                            const photosResponse = await getPhotosForArticleIds(articleIds);
                            console.log('Fetched photos:', photosResponse);

                            // Process the photos and associate with articles
                            const articlesWithPhotos = response.articles
                                .filter((x) => x.articleID !== article.articleID)
                                .map((article) => {
                                const photo = photosResponse[article.articleID];
                                if (photo && photo.image) {
                                    const photoData = photo.image.data;
                                    const uint8Array = new Uint8Array(photoData);
                                    const blob = new Blob([uint8Array], { type: 'image/png' });
                                    const reader = new FileReader();
                                    return new Promise((resolve) => {
                                        reader.onloadend = () => {
                                            article.imageUrl = reader.result; // base64 encoded image
                                            resolve(article);
                                        };
                                        reader.readAsDataURL(blob);
                                    });
                                }
                                return article;
                            });

                            // Wait for all articles to be processed with their images
                            const resolvedArticles = await Promise.all(articlesWithPhotos);
                            setUserArticles(resolvedArticles);
                        } catch (error) {
                            console.error('Error fetching photos:', error);
                        }
                    } else {
                        console.error("Invalid articleIds:", articleIds);
                    }
                }
            });
        }
    },[article])


    useEffect(() => {
        if (article && article.userID) {
            if (article.shippingType === 'both'){
                setShippingOptions([{title: 'Collection', description: 'Free - Collect from the seller'},{title: 'Delivery', description: '£2 - Delivery in 3-5 business days'}])
            }
            else if (article.shippingType === 'shipping'){
                setShippingOptions([{title: 'Delivery', description: '£2 - Delivery in 3-5 business days'}])
            }
            else if (article.shippingType === 'collection'){
                setShippingOptions([{title: 'Collection', description: 'Free - Collect from the seller'}])
            }
        }
    },[article])

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
    }, [article]);

    useEffect(() => {
        const getCoordinates = async () => {
            const postcode = articleUser?.location;

            if (postcode) {
                try {
                    const response = await axios.get(`https://api.postcodes.io/postcodes/${postcode}`);
                    if (response.data.result) {
                        const location = response.data.result;
                        setCoordinates([parseFloat(location.latitude), parseFloat(location.longitude)]);

                    } else {
                        console.error('No coordinates found for postcode.');
                    }
                } catch (error) {
                    console.error('Error fetching coordinates:', error);
                }
            }
        };

        getCoordinates();
    }, [articleUser?.location]);

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
                <div className="reviews">
                    <ul className="review-list">
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
                </div>

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

    const handlePhotoClick = (index) => {
        if (index >= 0 && index < photos.length) {
            setPhotoIndex(index);
            setIsOpen(true);
        } else {
            console.error('Invalid photo index');
        }
    };

    function handleAddToWishlist() {
        alert("Not implemented yet");
    }

    const handleShippingSelection = (index) => {
        setSelectedOption(index);
        if (shippingOptions[index].title === 'Collection') {
            setIsCollection(true);
            setIsShipping(false);
        }
        if (shippingOptions[index].title === 'Delivery') {
            setIsShipping(true);
            setIsCollection(false);
        }
    };

    const handleSeeAllArticles = () => {
        setIsOtherArticleModalOpen(true);
    };

    const handleViewArticle = (articleID) => {
        navigate(`/articles/${articleID}`);
        setIsOtherArticleModalOpen(false); // Close the modal after navigating
    };





    return (
        <div className="app">
            {/* Article details layout */}
            <div className="article-container">
                {/* Image section */}
                <div className="image-container">
                    {photos.length > 1 ? (
                        <div className={`image-grid${photos.length >= 4 ? '-4' : ''} grid-${photos.length}`}>
                            {photos.map((photo, index) => (
                                <div
                                    key={index}
                                    className={`image-item ${index === 0 ? 'main-image' : 'side-image'}`}
                                    onClick={() => handlePhotoClick(index)}
                                >
                                    <img src={photo} alt={`Article  ${index}`}/>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={'image-solo'} onClick={() => handlePhotoClick(0)}>
                            <img src={photos[0]} alt={`Article  0`}/>
                        </div>
                    )}

                    {/* Image Viewer */}
                    {isOpen && (
                        <SimpleImageViewer
                            src={photos}  // Array of photo sources
                            currentIndex={photoIndex}  // Initial index for the viewer
                            onClose={() => setIsOpen(false)}  // Close the viewer
                        />
                    )}
                </div>

                {/* Info section */}
                <div className="info-container">
                    <h1 className="title">{article.articleTitle}</h1>
                    <h2 className="price">£{article.price}</h2>
                    <p className="description">{article.description}</p>
                    <div className="separator"></div>

                    {/* Seller info */}
                    <div className="seller-info">

                        <div className="seller-details-container">

                            <div className="seller-details">
                                <div className="seller-header">
                                    <div className="seller-avatar" onClick={handleShowReviews}><RxAvatar size={55}/>
                                    </div>
                                    <p className="seller-name">{articleUser?.username}</p>
                                </div>
                                <p className="seller-rating">
                                    {rating ? (
                                        <>
                                            <StarRating rating={rating}/> ({reviewAmount} reviews)
                                        </>
                                    ) : (
                                        "No reviews yet"
                                    )}
                                </p>
                            </div>


                            {/* OpenStreetMap Location */}
                            <div className="seller-map">

                                {coordinates ? (
                                    <>
                                        <MapContainer center={coordinates} zoom={13}
                                                      style={{height: "200px", width: "100%", borderRadius: "10px"}}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                                            <Circle center={coordinates} radius={500} color="blue" fillOpacity={0.3}/>
                                        </MapContainer>
                                    </>
                                ) : (
                                    <p>Loading location...</p>
                                )}
                            </div>
                        </div>

                        <div className="seller-location"><GrMapLocation/>{articleUser?.location}</div>
                    </div>
                {showReviews && <ReviewModal onClose={() => setShowReviews(false)} />}


                <button className="shipping-button" onClick={() => setIsModalOpen(true)}>Select Shipping Method
                        <FaLongArrowAltRight/>
                    </button>
                    {selectedOption !== null && (
                        <p>Selected: {shippingOptions[selectedOption]?.title}</p>
                    )}
                    <div className="separator"></div>
                    {isModalOpen && (
                        <ShippingModal
                            options={shippingOptions}
                            onClose={() => setIsModalOpen(false)}
                            onSelect={handleShippingSelection}
                            selectedOption={selectedOption}
                        />
                    )}

                    {/* Buttons */}
                    <div className="purchase-button">
                        <button className="buy-button" onClick={handleBuy}>
                            <FontAwesomeIcon icon={faShoppingCart} style={{marginRight: '8px'}}/>
                            Buy now for £{isShipping ? article.price + 2 : article.price}
                        </button>
                    </div>

                    <div className="chat-button">
                        <button onClick={() => navigate(`/chat/${article.userID}`)}>
                            <FontAwesomeIcon icon={faComment} style={{marginRight: '8px'}}/>
                            Chat with Seller
                        </button>
                    </div>
                    <div className="wishlist-section">
                        <button onClick={handleAddToWishlist}>
                            <FontAwesomeIcon icon={faHeart} style={{color: 'red', marginRight: '8px'}}/>
                            Save for Later
                        </button>
                    </div>
                </div>
            </div>

            {/* Other Articles Section */}
            <div className="other-articles">
                <div className="other-articles-header">
                    <h3>More from this seller</h3>
                    <button className="see-all-button" onClick={handleSeeAllArticles}>View All <FaLongArrowAltRight
                        className="arrow-icon"/></button>
                </div>

                <div className="other-articles-container">
                    {userArticles.slice(0, 6).length > 0 ? (
                        userArticles.slice(0, 6).map((userArticle) => (
                            <div className="other-article-item" key={userArticle.articleID}
                                 onClick={() => handleViewArticle(userArticle.articleID)}>
                                <img
                                    src={userArticle.imageUrl || 'default_image.png'}
                                    alt={userArticle.articleTitle}
                                    className="other-article-image"
                                />
                                <h4>{userArticle.articleTitle}</h4>
                                <p>£{userArticle.price}</p>
                            </div>
                        ))
                    ) : (
                        <p>No other articles from this seller.</p>
                    )}
                </div>
            </div>

            {/* Other Articles Modal */}
            {isOtherArticleModalOpen && (
                <OtherArticlesModal
                    userArticles={userArticles}
                    onClose={() => setIsOtherArticleModalOpen(false)}
                    onViewArticle={handleViewArticle}
                />
            )}

        </div>
    );
};

export default ArticleDetails;