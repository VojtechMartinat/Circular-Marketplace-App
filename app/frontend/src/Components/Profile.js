import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { getUserArticles, getUserOrders } from "../services/userService";

const Profile = () => {
    const { id } = useParams();
    const [articles, setArticles] = useState(null);
    const [orders, setOrders] = useState(null);

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

    return (
        <div>
            <h1>Your Profile</h1>

            {/* Orders Section */}
            <h2>Orders</h2>
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

            {/* Articles Section */}
            <h2>Articles</h2>
            {articles && articles.length > 0 ? (
                articles.map(article => (
                    <div key={article.articleID}>
                        <Link to={`/articles/${article.articleID}`}>
                            <p>{article.articleTitle}</p>
                        </Link>
                        <p>Price: ${article.price}</p>
                        <p>Status: {article.state}</p>
                    </div>
                ))
            ) : (
                <p>No articles found</p>
            )}
        </div>
    );
};

export default Profile;
