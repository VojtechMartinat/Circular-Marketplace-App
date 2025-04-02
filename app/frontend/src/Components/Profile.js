import React, { useEffect, useState } from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import {
    getUser,
    getUserArticles,
    getUserOrders,
    addMoney,
    getUserRating,
    getUserWrittenReviews,
    getUserReviews
} from "../services/userService";
import { changeOrderStatus, getOrder, getOrderArticlePhotos } from "../services/orderService";
import { deleteArticle, getArticle, getArticleByOrderId } from "../services/articleService";
import { getArticlePhotos } from '../services/articleService';
import {FaGear, FaMessage, FaRegStar} from "react-icons/fa6";
import {FaStar, FaWallet,FaCheck} from "react-icons/fa";
import { auth } from "../services/firebaseService";
import { publishReview } from "../services/articleService";
import { RxAvatar } from "react-icons/rx";

import './Profile.css';
import {getUserWishlists} from "../services/wishlistService";

const Profile = () => {
    const { id } = useParams();
    const [articles, setArticles] = useState([]);
    const [articlesWithPhotos, setArticlesWithPhotos] = useState([]);
    const [orders, setOrders] = useState(null);
    const [orderDetails, setOrderDetails] = useState({});
    const [user, setUser] = useState(null);
    const [dbUser, setDbUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [topupAmount, setTopupAmount] = useState(0);
    const [boughtArticles, setBoughtArticles] = useState({});
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedArticleID, setSelectedArticleID] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [selectedOrderID, setSelectedOrderID] = useState(null);
    const [userRating, setUserRating] = useState(0);
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);
    const [favArticles, setFavArticles] = useState([]);
    const [favArticlesWithPhotos, setFavArticlesWithPhotos] = useState([]);
    const [isBought, setIsBought] = useState(false);
    const [userReviews, setUserReviews] = useState([]);
    const [reviewedArticles, setReviewedArticles] = useState([]);
    const [photoBatchIndex, setPhotoBatchIndex] = useState(0);
    const batchSize = 6;

    const [reviews, setReviews] = useState([]);
    const [reviewsWithUsers, setReviewsWithUsers] = useState([]);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);


    // const [isModalOpen, setIsModalOpen] = useState(false);

    const [activeTab, setActiveTab] = useState('Posted Items');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {

                setIsLoggedIn(true);
                setUser(currentUser);  // Set user state here
            } else {
                setIsLoggedIn(false);
                setUser(null);  // Reset user to null
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) return;
        getUser(user.uid).then((response) => {
            if (response) {
                setDbUser(response.user);
            }
        });
    }, [user]);

    useEffect(() => {
        if (dbUser) {
            getUserArticles(dbUser.userID).then(response => {
                if (response && response.articles) {
                    setArticles(response.articles);
                    setArticlesWithPhotos(response.articles.map(article => ({ ...article, imageUrl: null })));
                    setPhotoBatchIndex(0);
                }
            });
        }
    }, [dbUser]);

    useEffect(() => {
        if (articles.length > 0) {
            loadNextArticlePhotoBatch();
        }
    }, [photoBatchIndex, articles]);

    const loadNextArticlePhotoBatch = async () => {
        const start = photoBatchIndex * batchSize;
        const end = start + batchSize;
        const batch = articles.slice(start, end);

        if (batch.length === 0) return;

        try {
            const updatedArticles = await Promise.all(
                batch.map(async (article) => {
                    if (article.orderID) {
                        const orderDetails = await getOrder(article.orderID);
                        setOrderDetails(prev => ({ ...prev, [article.orderID]: orderDetails }));
                    }
                    const photosResponse = await getArticlePhotos(article.articleID);
                    if (photosResponse?.photos?.[0]) {
                        const photoData = photosResponse.photos[0].image.data;
                        const uint8Array = new Uint8Array(photoData);
                        const blob = new Blob([uint8Array], { type: 'image/png' });
                        const reader = new FileReader();

                        return new Promise((resolve) => {
                            reader.onloadend = () => {
                                resolve({ ...article, imageUrl: reader.result });
                            };
                            reader.readAsDataURL(blob);
                        });
                    }
                    return { ...article };
                })
            );

            setArticlesWithPhotos(prev => {
                const newArticles = [...prev];
                updatedArticles.forEach(updatedArticle => {
                    const index = newArticles.findIndex(a => a.articleID === updatedArticle.articleID);
                    if (index !== -1) {
                        newArticles[index] = updatedArticle;
                    }
                });
                return newArticles;
            });

            setTimeout(() => setPhotoBatchIndex(prev => prev + 1), 10);
        } catch (error) {
            console.error("Error fetching article photos:", error);
        }
    };

    useEffect(() => {
        if (dbUser){
            getUserOrders(dbUser.userID).then(response => {
                if (response && response.orders) {
                    setOrders(response.orders);
                } else {
                    console.log("error");
                }
                }
            );
        }
    }, [dbUser]);

    useEffect(() => {
        if (dbUser){
            getUserRating(dbUser.userID).then(response => {
                if (response && response.averageRating) {
                    setUserRating(response.averageRating);
                } else {
                    console.log("error");
                }
            });
        }
    }, [dbUser]);

    useEffect(() => {
        if (articles) {
            const fetchOrderDetails = async () => {
                try {
                    const details = {};
                    const updatedArticles = await Promise.all(
                        articles.map(async (article) => {
                            if (article.orderID) {
                                details[article.orderID] = await getOrder(article.orderID);
                            }
                                // Fetch photos associated with the article
                                const photosResponse = await getArticlePhotos(article.articleID);
                                if (photosResponse && photosResponse.photos && photosResponse.photos[0]) {
                                    const photoData = photosResponse.photos[0].image.data;
                                    const uint8Array = new Uint8Array(photoData);
                                    const blob = new Blob([uint8Array], {type: 'image/png'});
                                    const reader = new FileReader();

                                    return new Promise((resolve) => {
                                        reader.onloadend = () => {
                                            article.imageUrl = reader.result; // Add image URL to article
                                            resolve(article);
                                        };
                                        reader.readAsDataURL(blob);
                                    });
                                }

                            return article; // Return article in case no photos are found
                        })
                    );

                    // Update the articles with photos
                    setArticlesWithPhotos(updatedArticles);
                    // Set the fetched order details
                    setOrderDetails(details);
                } catch (error) {
                    console.log("Error fetching order details or photos:", error);
                }
            };

            fetchOrderDetails();
        }
    }, [articles]);

    useEffect(() => {
        if (dbUser){
            getUserWishlists(dbUser.userID).then(response => {
                if (response && response.wishlists) {
                    setWishlist(response.wishlists);
                } else {
                    console.log("error");
                }
            });
        }
    },[dbUser])

    useEffect(() => {
        if (wishlist) {
            const fetchFavArticles = async () => {
                try {
                    const updatedFavArticles = await Promise.all(
                        wishlist.map(async (wishlist) => {
                            const article = await getArticle(wishlist.articleID);
                            return article ? article.article : wishlist;
                        })
                    );
                    setFavArticles(updatedFavArticles);
                    setFavArticlesWithPhotos(updatedFavArticles.map(article => ({ ...article, imageUrl: null })));
                } catch (error) {
                    console.error("Error fetching favourite articles:", error);
                }
            };
            fetchFavArticles();
        }
    }, [wishlist]);

    useEffect(() => {
        if (favArticles.length > 0) {
            const loadFavPhotos = async () => {
                const start = photoBatchIndex * batchSize;
                const end = start + batchSize;
                const batch = favArticles.slice(start, end);

                if (batch.length === 0) return;

                try {
                    const updatedFavArticles = await Promise.all(
                        batch.map(async (article) => {
                            const photosResponse = await getArticlePhotos(article.articleID);
                            if (photosResponse?.photos?.[0]) {
                                const photoData = photosResponse.photos[0].image.data;
                                const uint8Array = new Uint8Array(photoData);
                                const blob = new Blob([uint8Array], { type: 'image/png' });
                                const reader = new FileReader();

                                return new Promise((resolve) => {
                                    reader.onloadend = () => {
                                        resolve({ ...article, imageUrl: reader.result });
                                    };
                                    reader.readAsDataURL(blob);
                                });
                            }
                            return { ...article };
                        })
                    );

                    setFavArticlesWithPhotos(prev => {
                        const newArticles = [...prev];
                        updatedFavArticles.forEach(updatedArticle => {
                            const index = newArticles.findIndex(a => a.articleID === updatedArticle.articleID);
                            if (index !== -1) {
                                newArticles[index] = updatedArticle;
                            }
                        });
                        return newArticles;
                    });
                } catch (error) {
                    console.error("Error fetching favorite article photos:", error);
                }
            };
            loadFavPhotos();
        }
    }, [favArticles, photoBatchIndex]);

    useEffect(() => {
        if (favArticles){
            const fetchFavArticlePhotos = async () => {
                try {
                    const updatedFavArticles = await Promise.all(
                        favArticles.map(async (article) => {
                            const photosResponse = await getArticlePhotos(article.articleID);
                            if (photosResponse && photosResponse.photos && photosResponse.photos[0]) {
                                const photoData = photosResponse.photos[0].image.data;
                                const uint8Array = new Uint8Array(photoData);
                                const blob = new Blob([uint8Array], { type: 'image/png' });
                                const reader = new FileReader();

                                return new Promise((resolve) => {
                                    reader.onloadend = () => {
                                        article.imageUrl = reader.result;
                                        resolve(article);
                                    };
                                    reader.readAsDataURL(blob);
                                });
                            }
                            return article;
                        })
                    );
                    setFavArticlesWithPhotos(updatedFavArticles);
                } catch (error) {
                    console.error("Error fetching favourite articles:", error);
                }
            };
            fetchFavArticlePhotos()
        }
    },[favArticles])


    useEffect(() => {
        const fetchOrderPhotos = async () => {
            try {
                if (!orders || orders.length === 0) {
                    console.log('No orders found to fetch photos');
                    return;
                }

                const updatedOrders = await Promise.all(
                    orders.map(async (order) => {
                        try {
                            const photosResponse = await getOrderArticlePhotos(order.orderID);

                            if (photosResponse?.photos?.[0]) {
                                const photoData = photosResponse.photos[0].image.data;
                                const uint8Array = new Uint8Array(photoData);
                                const blob = new Blob([uint8Array], { type: 'image/png' });
                                const reader = new FileReader();
                                return new Promise((resolve) => {
                                    reader.onloadend = () => {
                                        order.imageUrl = reader.result;
                                        resolve(order);
                                    };
                                    reader.readAsDataURL(blob);
                                });
                            }
                        } catch (error) {
                            console.error(`Error fetching photos for order ${order.orderID}:`, error);
                        }
                        return order;
                    })
                );


                const ordersChanged = !updatedOrders.every((order, index) => order.imageUrl === orders[index]?.imageUrl);
                if (ordersChanged) {
                    setOrders([...updatedOrders]);
                }
            } catch (error) {
                console.error("Error fetching order photos:", error);
            }
        };

        fetchOrderPhotos();
        const interval = setInterval(fetchOrderPhotos, 30000);

        return () => clearInterval(interval);
    }, [articlesWithPhotos]);

    useEffect(() => {
        if (orders) {
            const fetchUserIDs = async () => {
                const userIDMap = {};
                for (const order of orders) {
                    const article = await getArticleByOrderId(order.orderID);
                    if (article) {
                        userIDMap[order.orderID] = article.articles[0];
                    }
                }
                setBoughtArticles(userIDMap);
            };
            fetchUserIDs();
        }
    }, [orders]);

    useEffect(() => {
        if (user) {
            getUserWrittenReviews(user.uid).then(response => {
                if (response && response.reviews) {
                    setUserReviews(response.reviews);
                }
            }).catch(error => console.error("Error fetching user reviews:", error));
        }
    }, [user]);

    const handleDeleteArticle = async (articleID) => {
        try {
            await deleteArticle(articleID); // Call the service function to delete the article
            setArticles(prevArticles => prevArticles.filter(article => article.articleID !== articleID)); // Update state
            alert("Article deleted successfully.");
            window.location.reload();
        } catch (error) {
            console.error("Error deleting article:", error);
            alert("Failed to delete article.");
        }
    };

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

    const handleTopup = async (amount) => {
        if (amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }
        if (amount > 500) {
            alert("Please enter a smaller amount. The limit is 500");
            return;
        }
        try {
            await addMoney(id, amount);
            alert("Top-up successful.");
            window.location.reload();
        } catch (error) {
            console.error("Error topping up:", error);
            alert("Failed to top up.");
        }
    };

    const handleReviewClick = (articleID, orderID, isBought) => {
        if (!articleID) {
            console.error("Article ID is undefined for order:", orderID);
            alert("There was an issue retrieving the article. Please try again later.");
            return;
        }
        setSelectedArticleID(articleID);
        setSelectedOrderID(orderID);
        setShowReviewModal(true);
        setIsBought(isBought);

    };

    async function handleSubmitReview() {
        if (!selectedArticleID || !selectedOrderID) {
            console.error("Missing article or order information.");
            alert("Cannot submit review without correct information.");
            return;
        }
        const reviewer = user?.uid;
        const userID = isBought
            ? boughtArticles[selectedOrderID]?.userID  // For bought articles, userID is the seller
            : orderDetails[selectedOrderID]?.order?.userID;  // For sold articles, userID is the buyer        const reviewer = user.userID;
        if (!userID) {
            console.error("User ID not found for order:", selectedOrderID);
            alert("Cannot submit review without user information.");
            return;
        }

        const reviewData = {
            articleID: selectedArticleID,
            userID,
            rating,
            comment,
            reviewer,
        };

        try {
            await publishReview(reviewData);

            setUserReviews((prevReviews) => [
                ...prevReviews,
                { articleID: selectedArticleID, userID, rating, comment, reviewer }
            ]);
            alert("Review submitted successfully!");
            setReviewedArticles(prevArticles => prevArticles.filter(article => article.articleID !== reviewData.id));
            setRating(0);
            setComment("");
            setShowReviewModal(false);
        } catch (error) {
            console.log("Logged-in User:", user);
            console.error("Failed to submit review:", error.response?.data || error.message);
            alert("Failed to submit review.");

        }
    }


    const [dropdowns, setDropdowns] = useState({
        bought: false,
        sold: false,
        posted: false,
        favourited: false,
    });

    const ReviewModal = ({onClose}) => {
        return (
            <div className="review-modal-overlay" onClick={onClose}>
                <div className="review-modal-content">
                    <h2>Reviews for {dbUser?.username}</h2>
                    <div className="reviews">
                        <ul className="review-list">
                            {reviews.length > 0 ? (
                                reviews.map((review, index) => (
                                    <li key={index}>
                                        <span><strong>{reviewsWithUsers[review?.reviewID]?.user?.username}</strong>: {review.comment}</span>
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
    const toggleDropdown = (key) => {
        setDropdowns((prev) => {

            const newDropdowns = {
                bought: false,
                sold: false,
                posted: false,
                favourited: false,
            };
            newDropdowns[key] = !prev[key];
            return newDropdowns;
        });
    };

    const handleChangeOrderStatus = async (orderID, collectionMethod) => {
        try {
            const newStatus = collectionMethod === 'delivery' ? 'shipped' : 'collected'
            await changeOrderStatus(orderID, newStatus);
            setOrderDetails(prevDetails => ({
                ...prevDetails,
                [orderID]: {
                    ...prevDetails[orderID],
                    order: {
                        ...prevDetails[orderID].order,
                        orderStatus: newStatus
                    }
                }
            }));
            alert("Order status changed")
            window.location.reload();
        } catch (error) {
            console.log(error)
            console.error("Error changing the status:", error);
            alert("Failed to change the status.");
        }
    }
    const [showTopupOptions, setShowTopupOptions] = useState(false);


    useEffect(() => {
        if (dbUser){
            getUserReviews(dbUser.userID).then(response => {
                if (response && response.reviews) {
                    setReviews(response.reviews);
                }
            });
        }
    }, [dbUser]);
    useEffect(() => {
        if (reviews){
            const fetchUserIDs = async () => {
                const userIDMap = {};
                for (const review of reviews) {
                    const user = await getUser(review.reviewer);
                    if (user) {
                        userIDMap[review.reviewID] = user;
                    }
                }
                setReviewsWithUsers(userIDMap);
            };
            fetchUserIDs();
        }
    },[reviews])

    const handleShowReviews = () => {
        setIsReviewModalOpen(true);

    }
    return (
        <div className="dashboard-container">
            {/* Header */}


            {/* Main Content */}
            {dbUser && dbUser.userID === user?.uid ? (
                <div className="main-content">
                    {/* Sidebar (Profile Section) */}
                    <div className="sidebar">
                        <div className="profile">
                            <div className="avatar-container">
                                <RxAvatar size={100} className="avatar" onClick={handleShowReviews}/>
                            </div>
                            <h2>{dbUser.username}</h2>
                            <p className="member-since">
                            Member since {new Date(dbUser.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long"
                            })}
                            </p>

                            <div className="rating-verified">
                                <span className="rating">
                                    <FaStar className="star-icon"/>
                                    <span className="rating-text">{userRating}</span>
                                </span>
                                <span className="verified">
                                    <FaCheck className="verified-icon"/>
                                    <span className="verified-text">Verified</span>
                                </span>
                            </div>
                            <Link to="/logout">
                                <button className="edit-profile-btn">Logout</button>
                            </Link>
                        </div>

                        {/* Wallet Section */}
                        <div className="wallet">
                        <h3>Wallet Balance</h3>
                            <div className="balance">
                                <FaWallet size={24} style={{ color: 'black' }} />
                                <span>${dbUser?.wallet || 0}</span>
                            </div>
                            <button className="top-up-btn" onClick={() => setShowTopupOptions(true)}>+ Top Up</button>
                        </div>

                        {/* Top-up Modal */}
                        {showTopupOptions && (
                            <div className="topup-overlay">
                                <div className="topup-modal">
                                    <button className="close-button" onClick={() => setShowTopupOptions(false)}>✖</button>
                                    <p className="topup-subtext">Select an option below or enter a custom amount</p>
                                    <div className="topup-options">
                                        <button onClick={() => handleTopup(5)}>$5</button>
                                        <button onClick={() => handleTopup(10)}>$10</button>
                                        <button onClick={() => handleTopup(20)}>$20</button>
                                        <div className="custom-topup">
                                            <input
                                                type="number"
                                                value={topupAmount === 0 ? "" : topupAmount}
                                                onChange={(e) => setTopupAmount(Number(e.target.value) || 0)}
                                                placeholder="Enter custom amount"
                                            />
                                            <button onClick={() => handleTopup(topupAmount)}>Add Money</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {isReviewModalOpen && <ReviewModal onClose={() => setIsReviewModalOpen(false)} />}
                    {/* Items Section */}
                    <div className="items-section">
                        {/* Tabs */}
                        <div className="tabs">
                            {['Posted Items', 'Sold Items', 'Bought Items', 'Favourited'].map((tab) => (
                                <button
                                    key={tab}
                                    className={`tab ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Posted Items */}
                        {activeTab === 'Posted Items' && (
                            <div className="items-grid">
                                {articles && articles.some(article => article.state === "uploaded") ? (
                                    articles.map((article) =>
                                        article.orderID === null ? (
                                            <div
                                                key={article.articleID}
                                                className="item-card"
                                                onClick={() => navigate(`/articles/${article.articleID}`)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {article.imageUrl ? (
                                                    <img src={article.imageUrl} alt={article.articleTitle} className="item-image" />
                                                ) : (
                                                    <div className="item-image-placeholder">📷</div>
                                                )}
                                                <p className="item-title">{article.articleTitle}</p>
                                                <p className="date">
                                                    Posted on {new Date(dbUser.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric"
                                                })}
                                                </p>
                                                <p className="price">${article.price}</p>
                                                <span className="status active">{article.state?.charAt(0).toUpperCase() + article.state?.slice(1)}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent navigation to article page
                                                        handleDeleteArticle(article.articleID);
                                                    }}
                                                    className="delete-button"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        ) : null
                                    )
                                ) : (
                                    <p>No articles found</p>
                                )}
                            </div>
                        )}

                        {/* Sold Items */}
                        {activeTab === 'Sold Items' && (
                            <div className="items-grid">
                                {articles && articles.some(article => article.state === "sold") ? (
                                    articles.map((article) =>
                                            article.orderID !== null ? (
                                                <div
                                                    key={article.articleID}
                                                    className="item-card"
                                                    onClick={() => navigate(`/articles/${article.articleID}`)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    {article.imageUrl ? (
                                                        <img src={article.imageUrl} alt={article.articleTitle} className="item-image" />
                                                    ) : (
                                                        <div className="item-image-placeholder">📷</div>
                                                    )}
                                                    <p className="item-title">{article.articleTitle}</p>
                                                    <p className="date">
                                                        Posted on {new Date(dbUser.createdAt).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric"
                                                    })}
                                                    </p>
                                                    <p className="price">${article.price}</p>
                                                    <span className={`status-badge status-${orderDetails[article.orderID]?.order?.orderStatus}`}>
                            {orderDetails[article.orderID]?.order?.orderStatus?.charAt(0).toUpperCase() +
                                orderDetails[article.orderID]?.order?.orderStatus?.slice(1)}
                        </span>
                                                    {orderDetails[article.orderID]?.order?.orderStatus !== 'collected' &&
                                                        orderDetails[article.orderID]?.order?.orderStatus !== 'shipped' && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // Prevent navigation to article page
                                                                    handleChangeOrderStatus(article.orderID, orderDetails[article.orderID]?.order?.collectionMethod);
                                                                }}
                                                                className="action-button"
                                                            >
                                                                Change status to{' '}
                                                                {orderDetails[article.orderID]?.order?.collectionMethod === 'delivery' ? 'shipped' : 'collected'}
                                                            </button>
                                                        )}
                                                    {(orderDetails[article.orderID]?.order?.orderStatus === 'shipped' ||
                                                            orderDetails[article.orderID]?.order?.orderStatus === 'collected') &&
                                                        !userReviews.some(review => review.articleID === article.articleID) &&
                                                        (
                                                            <button onClick={(e) => {
                                                                e.stopPropagation(); // Prevent click from bubbling up
                                                                handleReviewClick(article.articleID, article.orderID, false);
                                                            }}>
                                                                Write a Review
                                                            </button>
                                                        )}
                                                    <Link
                                                        to={`/chat/${orderDetails[article.orderID]?.order?.userID}`}
                                                        className="message-button"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <FaMessage size={24} style={{ color: 'white' }} />
                                                        <span className="message-label">Message Buyer</span>
                                                    </Link>
                                                </div>
                                            ) : null
                                    )
                                ) : (
                                    <p>No articles found</p>
                                )}
                            </div>
                        )}

                        {/* Bought Items */}
                        {activeTab === 'Bought Items' && (
                            <div className="items-grid">
                                {orders && orders.length > 0 ? (
                                    orders.map((order) => (
                                        <div
                                            key={order.orderID}
                                            className="item-card"
                                            onClick={() => navigate(`/articles/${boughtArticles[order?.orderID]?.articleID}`)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {order.imageUrl ? (
                                                <img src={order.imageUrl} alt={order.orderID} className="item-image" />
                                            ) : (
                                                <div className="item-image-placeholder">📷</div>
                                            )}
                                            <p className="item-title">{boughtArticles[order?.orderID]?.articleTitle || "Unknown Item"}</p>
                                            <p className="date">
                                                Purchased on {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            })}
                                            </p>
                                            <p className="price">${order.totalPrice}</p>
                                            <span className={`status-badge status-${order.orderStatus}`}>
                                                {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
                                            </span>
                                            {(order.orderStatus === "shipped" || order.orderStatus === "collected") &&
                                                boughtArticles[order.orderID]?.articleID &&
                                                !userReviews.some(review => review.articleID === boughtArticles[order.orderID]?.articleID) &&
                                                (

                                                    <button onClick={(e) => {
                                                        e.stopPropagation(); // Prevent click from bubbling up
                                                        handleReviewClick(
                                                            boughtArticles[order.orderID].articleID,
                                                            order.orderID,
                                                            true
                                                        );
                                                    }}>
                                                        Write a Review
                                                    </button>
                                                )}

                                            <Link
                                                to={`/chat/${boughtArticles[order?.orderID]?.userID}`}
                                                className="message-button"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <FaMessage size={24} style={{ color: 'white' }} />
                                                <span className="message-label">Message Seller</span>
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <p>No orders found</p>
                                )}
                            </div>
                        )}

                        {/* Favourited Items */}
                        {activeTab === 'Favourited' && (
                            <div className="items-grid">
                                {favArticlesWithPhotos && favArticlesWithPhotos.length > 0 ? (
                                    favArticlesWithPhotos.filter(x => x.state === "uploaded").map((article) => (
                                        <div
                                            key={article.articleID}
                                            className="item-card"
                                            onClick={() => navigate(`/articles/${article.articleID}`)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {article.imageUrl ? (
                                                <img src={article.imageUrl} alt={article.articleTitle} className="item-image" />
                                            ) : (
                                                <div className="item-image-placeholder">📷</div>
                                            )}
                                            <p className="item-title">{article.articleTitle}</p>
                                            <p className="date">
                                                Added on {new Date(article.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            })}
                                            </p>
                                            <p className="price">${article.price}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No favourite articles found</p>
                                )}
                            </div>
                        )}
                        {showReviewModal && (
                            <div className="review-modal-overlay">
                                <div className="review-modal">
                                    <h2>Write a Review</h2>
                                    <p>Rate this product:</p>

                                    {/* Rating Input */}
                                    <div className="rating-stars">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                onClick={() => setRating(star)}
                                                style={{ cursor: "pointer", fontSize: "24px", color: star <= rating ? "gold" : "gray" }}
                                            >
                                            ★
                                        </span>
                                        ))}
                                    </div>

                                    {/* Comment Input */}
                                    <textarea className="review-textarea"
                                              placeholder="Write your review here..."
                                              value={comment}
                                              onChange={(e) => setComment(e.target.value)}
                                    />
                                    <div className="review-buttons">
                                        {/* Submit & Close Buttons */}
                                        <button onClick={() => handleSubmitReview()}>Submit Review</button>
                                        <button onClick={() => setShowReviewModal(false)}>Cancel</button>
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                </div>

            ) : dbUser ? (
                <p>ERROR: USERS NOT MATCHING</p>
            ) : (
                <div className="main-content">
                    <div className="sidebar">
                        <div className="profile">
                            <div className="avatar-container">
                            </div>


                            <div className="rating-verified">
                                <span className="rating">
                                    <FaStar className="star-icon"/>
                                    <span className="rating-text">{userRating}</span>
                                </span>
                                <span className="verified">
                                    <FaCheck className="verified-icon"/>
                                    <span className="verified-text">Verified</span>
                                </span>
                            </div>

                        </div>

                        <div className="wallet">
                            <h3>Wallet Balance</h3>
                            <div className="balance">
                                <FaWallet size={24} style={{color: 'black'}}/>
                            </div>
                            <button className="top-up-btn" onClick={() => setShowTopupOptions(true)}>+ Top Up</button>
                        </div>


                    </div>

                    <div className="items-section">
                        {/* Tabs */}
                        <div className="tabs">
                            {['Posted Items', 'Sold Items', 'Bought Items', 'Favourited'].map((tab) => (
                                <button
                                    key={tab}
                                    className={`tab ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Posted Items */}
                        {activeTab === 'Posted Items' && (
                            <div className="items-grid">

                            </div>
                        )}

                        {/* Sold Items */}
                        {activeTab === 'Sold Items' && (
                            <div className="items-grid">

                            </div>
                        )}

                        {/* Bought Items */}
                        {activeTab === 'Bought Items' && (
                            <div className="items-grid">

                            </div>
                        )}

                        {/* Favourited Items */}
                        {activeTab === 'Favourited' && (
                            <div className="items-grid">

                            </div>
                        )}
                    </div>
                    )

                    {/* Chat Button */}

                </div>
            )}

            {/* Chat Button */}
            <Link to="/chats" className="chat-btn">
                <FaMessage size={24} style={{color: 'white'}}/>
            </Link>
        </div>
    );
};

export default Profile;