import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {getUserArticles, getUserOrders} from "../services/userService";
import {deleteArticle} from "../services/articleService";
import {changeOrderStatus, getOrder} from "../services/orderService"

const Profile = () => {
    const { id } = useParams();
    const [articles, setArticles] = useState(null);
    const [orders, setOrders] = useState(null);
    const [orderDetails, setOrderDetails] = useState({});
    useEffect(() => {
        getUserArticles(id).then(response => {
            console.log(response);
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
                    for (const article of articles) {
                        if (article.orderID) {
                            details[article.orderID] = await getOrder(article.orderID);
                        }
                    }
                    setOrderDetails(details);
                } catch (error) {
                    console.log("Error fetching order details:", error);
                }
            };

            fetchOrderDetails(); // Call the async function
        }
    }, [articles]);


    const handleDeleteArticle = async (articleID) => {
        try {
            await deleteArticle(articleID); // Call the service function to delete the article
            setArticles(prevArticles => prevArticles.filter(article => article.articleID !== articleID)); // Update state
            alert("Article deleted successfully.");
        } catch (error) {
            console.error("Error deleting article:", error);
            alert("Failed to delete article.");
        }
    };

    const handleChangeOrderStatus = async (orderID, collectionMethod) => {
        try {
            const newStatus = collectionMethod === 'delivery' ? 'shipped' : 'collected'
            await changeOrderStatus(orderID, newStatus);
            alert("Order status changed")
        } catch (error) {
            console.log(error)
            console.error("Error changing the status:", error);
            alert("Failed to change the status.");
        }
    }

    return (
        <div>
            <h1>Your Profile</h1>

            {/* Orders Section */}
            <h2>Articles bought</h2>
            {orders && orders.length > 0 ? (
                orders.map(order => (
                    <div key={order.orderID}>
                        <p>{order.orderID}</p>
                        <p>{order.totalPrice}</p>
                        <p>{order.collectionMethod}</p>
                        <p>{order.orderStatus}</p>
                    </div>
                ))
            ) : (
                <p>No orders found</p>
            )}
            <h2>Articles Sold</h2>
            {articles && articles.length > 0 ? (
                articles.map(article =>
                    article.orderID !== null ? (
                        <div key={article.articleID}>
                            <Link to={`/articles/${article.articleID}`}>
                                <p>{article.articleTitle}</p>
                            </Link>
                            <p>Price: ${article.price}</p>
                            <p>Status: {article.state}</p>
                            {orderDetails[article.orderID] ? (
                                <button
                                    onClick={() =>
                                        handleChangeOrderStatus(article.orderID, orderDetails[article.orderID].collectionMethod)
                                    }
                                >
                                    Change status to{' '}
                                    {orderDetails[article.orderID].collectionMethod === 'delivery'
                                        ? 'shipped'
                                        : 'collected'}
                                </button>
                            ) : (
                                <p>Loading order details...</p>
                            )}
                        </div>
                    ) : null
                )
            ) : (
                <p>No articles found</p>
            )}
            <h2>Articles posted</h2>
            {articles && articles.length > 0 ? (
                articles.map(article =>
                    article.orderID === null ? (
                        <div key={article.articleID}>
                            <Link to={`/articles/${article.articleID}`}>
                                <p>{article.articleTitle}</p>
                            </Link>
                            <p>Price: ${article.price}</p>
                            <p>Status: {article.state}</p>
                            <button
                                onClick={() => handleDeleteArticle(article.articleID)}>
                                Delete article
                            </button>
                        </div>
                    ) : null
                )
            ) : (
                <p>No articles found</p>
            )}

        </div>
    );
};

export default Profile;
