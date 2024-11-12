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
            if (response) {
                setArticles(response.articles);
            } else {
                console.log("error");
            }
        });
    }, [id]);

    useEffect(() => {
        getUserOrders(id).then(response => {
            console.log(response);
            if (response) {
                setOrders(response.orders);
            } else {
                console.log("error");
            }
        });
    }, [id]);

    return (
        <div>
            <h1>Your Profile</h1>
            <p>Orders</p>
            {orders ? orders.map(order => (
                <div key={order.orderID}>
                    <h2>{order.orderID}</h2>
                    <p>{order.totalPrice}</p>
                    <p>{order.collectionMethod}</p>
                    <p>{order.orderStatus}</p>
                </div>
            )) : <p>No orders found</p>}
            <p>Articles</p>
            {articles ? articles.map(article => (
                <div key={article.articleID}>
                    <Link to={`/articles/${article.articleID}`}>
                        <h2>{article.articleTitle}</h2>
                    </Link>
                    <p>Price: ${article.price}</p>
                </div>
            )) : <p>No articles found</p>}
        </div>
    );
};

export default Profile;