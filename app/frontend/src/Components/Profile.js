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
                            console.log(details[article.orderID].order.collectionMethod)
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
            <h2>Articles Bought</h2>
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
                            <p>Status: {orderDetails[article.orderID]?.order.orderStatus}</p>
                            {orderDetails[article.orderID]?.order ? (<p>Collection Method: {orderDetails[article.orderID]?.order.collectionMethod}</p>) : null}
                            {orderDetails[article.orderID] && orderDetails[article.orderID].order && orderDetails[article.orderID].order.orderStatus !== 'collected'
                            && orderDetails[article.orderID].order.orderStatus !== 'shipped' ? (
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
                            ) : null}
                        </div>
                    ) : null
                )
            ) : (
                <p>No articles found</p>
            )}
            <h2>Articles Posted</h2>
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
