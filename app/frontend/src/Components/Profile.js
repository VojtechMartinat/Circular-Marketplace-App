import React, { useEffect, useState } from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import {getUser, getUserArticles, getUserOrders, addMoney, getUserRating} from "../services/userService";
import { changeOrderStatus, getOrder, getOrderArticlePhotos } from "../services/orderService";
import { deleteArticle, getArticle, getArticleByOrderId } from "../services/articleService";
import { getArticlePhotos } from '../services/articleService';
import {FaGear, FaMessage, FaRegStar} from "react-icons/fa6";
import {FaStar, FaWallet,FaCheck} from "react-icons/fa";
import { auth } from "../services/firebaseService";
import { publishReview } from "../services/articleService";
import { RxAvatar } from "react-icons/rx";

import './Profile.css';

const Profile = () => {
    const { id } = useParams();
    const [articles, setArticles] = useState(null);
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


    // const [isModalOpen, setIsModalOpen] = useState(false);

    const [activeTab, setActiveTab] = useState('Posted Items');
    const [showTopupOptions, setShowTopupOptions] = useState(false);

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
        if (dbUser){
            getUserArticles(dbUser.userID).then(response => {
                if (response && response.articles) {
                    setArticles(response.articles);
                } else {
                    console.log("error");
                }
            });
        }
    }, [dbUser]);

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
                    setArticles(updatedArticles);
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
        const fetchOrderPhotos = async () => {
            try {
                if (!orders || orders.length === 0) return;
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

                setOrders(updatedOrders);
            } catch (error) {
                console.error("Error fetching order photos:", error);
            }
        };

        fetchOrderPhotos();
        const interval = setInterval(fetchOrderPhotos, 30000);

        return () => clearInterval(interval);
    }, [articles]);

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

    const handleReviewClick = (articleID, orderID) => {
        setSelectedArticleID(articleID);
        setSelectedOrderID(orderID);
        setShowReviewModal(true);
    };

    async function handleSubmitReview() {
        if (!selectedArticleID || !selectedOrderID) {
            console.error("Missing article or order information.");
            alert("Cannot submit review without correct information.");
            return;
        }

        const userID = boughtArticles[selectedOrderID]?.userID; // Fetch userID using orderID
        const reviewer = user.userID;
        if (!userID) {
            console.error("User ID not found for order:", selectedOrderID);
            alert("Cannot submit review without user information.");
            return;
        }

        const reviewData = {
            articleID: selectedArticleID,
            userID,  // Add userID to the request
            rating,
            comment,
            reviewer,
        };

        try {
            await publishReview(reviewData);
            alert("Review submitted successfully!");
            setRating(0);
            setComment("");
            setShowReviewModal(false);
        } catch (error) {
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
    return (
        <div className="dashboard-container">
            {/* Header */}


            {/* Main Content */}
            {dbUser && dbUser.userID === user?.uid ? (
                <div className="main-content">
                    {/* Sidebar (Profile Section) */}
                    <div className="sidebar">
                        <div className="profile">
                            <div className="avatar">
                                <RxAvatar size={100} />
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
                                <p>No favourited articles found</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : dbUser ? (
                <p>ERROR: USERS NOT MATCHING</p>
            ) : (
                <p>Loading...</p>
            )}

            {/* Chat Button */}
            <Link to="/chats" className="chat-btn">
                <FaMessage size={24} style={{ color: 'white' }} />
            </Link>
        </div>
    );
};

export default Profile;