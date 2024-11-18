import React, { useEffect, useState } from 'react';
import {useNavigate, useParams } from 'react-router-dom';
import { getArticle, getArticlePhotos } from '../services/articleService';
import {createOrder} from "../services/orderService";
import {useAuth} from "../Contexts/AuthContext";
const ArticleDetails = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [imageUrl, setImageUrl] = useState(null); // State to store image URL
    const { isLoggedIn, user } = useAuth(); // Access logged-in user data
    const navigate = useNavigate();
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
        if (!isLoggedIn){
            alert("Please log in to buy an article");
            return;
        }
        const orderData = {
            userID: user.userID,
            paymentMethodID : "4d530d77-217e-4a89-952e-f4cee8e3fe5c",
            dateOfPurchase : new Date().toISOString(),
            collectionMethod : "collection",
            articles:[
                { articleID: id }
            ]
        };
        createOrder(orderData)
            .then((res) => {
                alert(`Order created succesfully!`)
            })
            .catch((error) => {
                alert(`Error: ${error}`)
            })
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
