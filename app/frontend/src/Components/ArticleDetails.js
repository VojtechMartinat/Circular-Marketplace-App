import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css';
import { getArticle, getArticlePhotos } from '../services/articleService';
import { createOrder } from '../services/orderService';
import {getUser, getUserRating} from '../services/userService';
import './article.css';
import { FaLongArrowAltRight } from "react-icons/fa";
import {auth} from "../services/firebaseService";
import SimpleImageViewer from 'react-simple-image-viewer';
import ShippingModal from './ShippingModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

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
    const [isOpen, setIsOpen] = useState(false); // To control Lightbox
    const [photoIndex, setPhotoIndex] = useState(0); // Default to 0 if nothing is set
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [shippingOptions, setShippingOptions] = useState([]);

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
    const [rating, setRating] = useState(null);
    const [reviewAmount, setReviewAmount] = useState(null);

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

        // return (
        //     <div className="icons">
        //         <div className="top-items">
        //             <div className="dropdown">
        //                 <h2 style={{
        //                     display: "flex",
        //                     alignItems: "center",
        //                     textAlign: "left",
        //                     paddingLeft: 5,
        //                     gap: 10 // Adjust the gap as needed
        //                 }}>
        //                     <FaWallet size={30} style={{color: "black"}}/>
        //                     {dbUser?.wallet}£
        //                 </h2>
        //             </div>
        //             <div className="dropdown">
        //                 <FaGear size={30} onClick={toggleMenu} style={{color: 'black'}}/>
        //             </div>
        //             {isOpen && (
        //                 <div className="menu" >
        //                     <div className="menu-item" onClick={handleSharing}>Share</div>
        //                 </div>
        //             )}
        //         </div>
        //     </div>
        // );
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
    })

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
                                    <img src={photo} alt={`Article Image ${index}`}/>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={'image-solo'} onClick={() => handlePhotoClick(0)}>
                            <img src={photos[0]} alt={`Article Image 0`}/>
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
                        <div className="seller-avatar">👤</div>
                        <div className="seller-details">
                            <p className="seller-name">{articleUser?.username}</p>
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
                        <div className="seller-location">📍{articleUser?.location}</div>
                    </div>

                    <button className="shipping-button" onClick={() => setIsModalOpen(true)}>Select Shipping Method
                        <FaLongArrowAltRight />
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
                            <FontAwesomeIcon icon={faShoppingCart} style={{ marginRight: '8px' }} />
                            Buy now for £{isShipping ? article.price + 2 : article.price}
                        </button>
                    </div>

                    <div className="chat-button">
                        <button onClick={() => navigate(`/chat/${article.userID}`)}>
                            <FontAwesomeIcon icon={faComment} style={{ marginRight: '8px' }} />
                            Chat with Seller
                        </button>
                    </div>
                    <div className="wishlist-section">
                        <button onClick={handleAddToWishlist}>
                            <FontAwesomeIcon icon={faHeart} style={{ color: 'red', marginRight: '8px' }} />
                            Save for Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetails;