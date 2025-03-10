import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {getUser, getUserArticles, getUserOrders, addMoney} from "../services/userService";
import {deleteArticle, getArticle, getArticleByOrderId} from "../services/articleService";
import {changeOrderStatus, getOrder} from "../services/orderService"
import {getArticlePhotos} from '../services/articleService';
import { FaGear } from "react-icons/fa6";
import './Profile.css';
import {FaWallet} from "react-icons/fa";
import { publishReview } from "../services/articleService";


import { FaMessage } from "react-icons/fa6";

const Profile = () => {
    const { id } = useParams();
    const [articles, setArticles] = useState(null);
    const [orders, setOrders] = useState(null);
    const [orderDetails, setOrderDetails] = useState({}); // State to store order details for each user article
    const [user, setUser] = useState(null);
    const [topupAmount, setTopupAmount] = useState(0);
    const [boughtArticles, setBoughtArticles] = useState({});
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedArticleID, setSelectedArticleID] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [selectedOrderID, setSelectedOrderID] = useState(null);


    // const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getUser(id).then(response => {
            if (response){
                setUser(response.user);
            } else {
                console.log("error getting the user data");
            }
        })
    }, [id]);
    useEffect(() => {
        getUserArticles(id).then(response => {
            if (response && response.articles) {
                setArticles(response.articles);
            } else {
                console.log("error");
            }
        });
    }, [id]);

    useEffect(() => {
        getUserOrders(id).then(response => {
            console.log(response);
            if (response && response.orders) {
                setOrders(response.orders);
            } else {
                console.log("error");
            }
        });
    }, [id]);
    useEffect(() => {
        if (articles) {
            const fetchOrderDetails = async () => {
                try {
                    const details = {};
                    const updatedArticles = await Promise.all(
                        articles.map(async (article) => {
                            if (article.orderID) {
                                // Fetch the order details
                                details[article.orderID] = await getOrder(article.orderID);

                                // Fetch photos associated with the article
                                const photosResponse = await getArticlePhotos(article.articleID);
                                if (photosResponse && photosResponse.photos && photosResponse.photos[0]) {
                                    const photoData = photosResponse.photos[0].image.data;
                                    const uint8Array = new Uint8Array(photoData);
                                    const blob = new Blob([uint8Array], { type: 'image/png' });
                                    const reader = new FileReader();

                                    return new Promise((resolve) => {
                                        reader.onloadend = () => {
                                            article.imageUrl = reader.result; // Add image URL to article
                                            resolve(article);
                                        };
                                        reader.readAsDataURL(blob);
                                    });
                                }
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

            fetchOrderDetails(); // Call the async function
        }
    }, [articles]);

    useEffect(() => {
        if (orders) {
            const fetchUserIDs = async () => {
                const userIDMap = {};
                for (const order of orders) {
                    const article = await getArticleByOrderId(order.orderID);
                    if (article) {
                        userIDMap[order.orderID] = article.article;
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
            console.log("Submitting Review:", reviewData);
            await publishReview(reviewData);
            alert("Review submitted successfully!");
            setRating(0);
            setComment("");
            setShowReviewModal(false);
        } catch (error) {
            console.error("Failed to submit review:", error.response?.data || error.message);
            alert("Failed to submit review.");
            console.log("Selected Article ID:", selectedArticleID);
            console.log("Selected Order ID:", selectedOrderID);
            console.log("Rating:", rating);
            console.log("Comment:", comment);
            console.log("Logged-in User ID (Reviewer):", reviewer);
            console.log("Bought Articles:", boughtArticles);
            console.log("UserID from Bought Article:", boughtArticles[selectedOrderID]?.userID);

        }
    }


    const [dropdowns, setDropdowns] = useState({
        bought: false,
        sold: false,
        posted: false,
        favourited: false,
    });

    const toggleDropdown = (key) => {
        setDropdowns((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
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
    return (
        <div className="profile-back">
        <div className="profile-box">
            <header className="header2">
                <b>Your Profile</b>
            </header>

            <div className="dropdown-container">

                <div className="top-items">
                    <div className="dropdown" onClick={() => toggleDropdown('wallet')}>
                        <h2 style={{
                            display: "flex",
                            alignItems: "center",
                            textAlign: "left",
                            paddingLeft: 20,
                            gap: 20
                        }}>
                            <FaWallet size={30} style={{color: "black"}}/>
                            {user?.wallet}£
                        </h2>

                    </div>
                    <div className="icon">
                        <Link to="/chats">
                            <FaMessage size={30} style={{color: 'black'}}/>
                        </Link>
                    </div>
                    <div className="dropdown" onClick={() => toggleDropdown('settings')}>
                        <FaGear size={30} style={{color: 'black'}}/>
                    </div>
                </div>

                <div className="dropdown" onClick={() => toggleDropdown('favourited')}>
                    <h2>Favourited Articles</h2>
                </div>

                <div className="dropdown" onClick={() => toggleDropdown('bought')}>
                    <h2>Articles Bought</h2>
                    {dropdowns.bought && (
                        orders && orders.length > 0 ? (
                            <div className="orders-gallery">
                                {orders.map((order) => (
                                    <div key={order.orderID} className="order-box">
                                        {/* Render the order image */}
                                        {order.imageUrl ? (
                                            <img src={order.imageUrl} alt={order.orderID} className="order-image"/>
                                        ) : (
                                            <div className="product-image-placeholder">🖼️</div>
                                        )}

                                        <div className="order-details">
                                            <p><strong>Price:</strong> ${order.totalPrice}</p>
                                            <p><strong>Shipping Method:</strong> {order.collectionMethod}</p>
                                            <p><strong>Status:</strong> {order.orderStatus}</p>

                                            {/* Show Review Button if status is "shipped" or "collected" */}
                                            {(order.orderStatus === "shipped" || order.orderStatus === "collected") && (
                                                <button onClick={() => handleReviewClick(boughtArticles[order.orderID].articleID, order.orderID)}>Write a Review</button>
                                            )}
                                        </div>
                                        <div className="icon">
                                            <Link
                                                to={`/chat/${boughtArticles[order.orderID].userID}`}>
                                                <FaMessage size={30} style={{color: 'black'}}/>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No orders found</p>
                        )
                    )}
                </div>


                <div className="dropdown" onClick={() => toggleDropdown('sold')}>
                    <h2>Articles Sold</h2>
                    {dropdowns.sold && (
                        articles && articles.length > 0 ? (
                            <div className="orders-gallery">


                                {articles.map((article) => {

                                    return article.orderID !== null ? (
                                        <div key={article.articleID} className="order-box">
                                            {article.imageUrl ? (
                                                <img src={article.imageUrl} alt={article.articleTitle}
                                                     className="order-image"/>
                                            ) : (
                                                <div className="product-image-placeholder">🖼️</div>
                                            )}

                                            <div className="order-details">
                                                <Link to={`/articles/${article.articleID}`}>
                                                    <p className="product-name">{article.articleTitle}</p>
                                                </Link>
                                                <p><strong>Price:</strong> ${article.price}</p>
                                                <p>
                                                    <strong>Status:</strong> {orderDetails[article.orderID]?.order.orderStatus}
                                                </p>
                                                {orderDetails[article.orderID]?.order && (
                                                    <p><strong>Collection
                                                        Method:</strong> {orderDetails[article.orderID]?.order.collectionMethod}
                                                    </p>
                                                )}
                                                {orderDetails[article.orderID] && orderDetails[article.orderID].order &&
                                                    orderDetails[article.orderID].order.orderStatus !== 'collected' &&
                                                    orderDetails[article.orderID].order.orderStatus !== 'shipped' && (
                                                        <button
                                                            onClick={() =>
                                                                handleChangeOrderStatus(article.orderID, orderDetails[article.orderID].order.collectionMethod)
                                                            }
                                                        >
                                                            Change status to{' '}
                                                            {orderDetails[article.orderID].order.collectionMethod === 'delivery'
                                                                ? 'shipped'
                                                                : 'collected'}
                                                        </button>
                                                    )}
                                                {(orderDetails[article.orderID]?.order?.orderStatus === 'shipped' ||
                                                    orderDetails[article.orderID]?.order?.orderStatus === 'collected') && (
                                                    <button onClick={() => handleReviewClick(article.articleID, article.orderID)}>
                                                        Write a Review
                                                    </button>
                                                )}
                                                <div className="icon">
                                                    <Link
                                                        to={`/chat/${orderDetails[article.orderID]?.order?.userID}`}>
                                                    <FaMessage size={30} style={{color: 'black'}}/>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null;
                                })}

                            </div>
                        ) : (
                            <p>No articles found</p>
                        )
                    )}
                </div>


                <div className="dropdown" onClick={() => toggleDropdown('posted')}>
                    <h2>Articles Posted</h2>
                    {dropdowns.posted && (
                        articles && articles.length > 0 ? (
                            <div className="orders-gallery">
                                {articles.map((article) =>
                                    article.orderID === null ? (
                                        <div key={article.articleID} className="order-box">
                                            {/* Render the article image */}
                                            {article.imageUrl ? (
                                                <img src={article.imageUrl} alt={article.articleTitle}
                                                     className="order-image"/>
                                            ) : (
                                                <div className="product-image-placeholder">🖼️</div>
                                            )}

                                            <div className="order-details">
                                                <Link to={`/articles/${article.articleID}`}>
                                                    <p className="product-name">{article.articleTitle}</p>
                                                </Link>
                                                <p><strong>Price:</strong> ${article.price}</p>
                                                <p><strong>Status:</strong> {article.state}</p>
                                                <button
                                                    onClick={() => handleDeleteArticle(article.articleID)}
                                                    className="delete-button"
                                                >
                                                    Delete article
                                                </button>
                                            </div>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        ) : (
                            <p>No articles found</p>
                        )
                    )}
                </div>
                <div className="topup-container">
                    <button onClick={() => setShowTopupOptions(true)}>Add Money</button>

                    {showTopupOptions && (
                        <div className="topup-overlay">
                            <div className="topup-modal">
                                <button className="close-button" onClick={() => setShowTopupOptions(false)}>✖</button>

                                <p className="topup-subtext">Select an option below or enter a custom amount</p>

                                <div className="topup-options">
                                    <button onClick={() => handleTopup(5)}>5£</button>
                                    <button onClick={() => handleTopup(10)}>10£</button>
                                    <button onClick={() => handleTopup(20)}>20£</button>

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

                    {showReviewModal && (
                        <div className="modal-overlay">
                            <div className="modal">
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
                                <textarea
                                    placeholder="Write your review here..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />

                                {/* Submit & Close Buttons */}
                                <button onClick={() => handleSubmitReview()}>Submit Review</button>
                                <button onClick={() => setShowReviewModal(false)}>Cancel</button>
                            </div>
                        </div>
                    )}

                </div>


            </div>

        </div>

        </div>
    )
        ;
};
export default Profile;
