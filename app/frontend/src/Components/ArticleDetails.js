import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArticle, getArticlePhotos } from '../services/articleService';
import {createOrder} from "../services/orderService";

const ArticleDetails = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [imageUrl, setImageUrl] = useState(null); // State to store image URL

    useEffect(() => {
        getArticle(id).then(response => {
            if (response) {
                setArticle(response.article);
            }
        });
    }, [id]);

    useEffect(() => {
        getArticlePhotos(id).then(response => {
            console.log("Article photos response:", response);
            if (response && response.photos && response.photos[0]) {
                const imageData = response.photos[0].image.data; // Assuming this is an array of bytes
                const base64data = arrayBufferToBase64(imageData);
                console.log(base64data);
                setImageUrl(base64data);
            }
        });
    }, [id]);

    const arrayBufferToBase64 = (array) => {
        let binary = '';
        for (let i = 0; i < array.length; i++) {
            binary += String.fromCharCode(array[i]);
        }
        return 'data:image/png;base64,' + window.btoa(binary);
    };

    const handleBuy = async () => {
        try {
            const orderData = {
                userID: id,
                paymentMethodID : "4d530d77-217e-4a89-952e-f4cee8e3fe5c",
                dateOfPurchase : Date.now(),
                collectionMethod : "collection",
                articles:{
                    articleID: article.articleID,
                }
            };
            const response = await createOrder(orderData);
            alert('Order created successfully!');
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Failed to create order');
        }
    };

    // If article or imageUrl is not available, show loading
    if (!article) return <div>Loading...</div>;

    return (
        <div>
            <h1>{article.articleTitle}</h1>
            <img src={imageUrl} alt={"cat"}/>
            <p>{article.description}</p>
            <p>Price: ${article.price}</p>
            <p>Status: {article.state}</p>
            <button onClick={handleBuy}>Buy</button>
        </div>
    );
};

export default ArticleDetails;
