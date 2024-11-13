
import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { createArticle } from '../services/articleService';
import { useAuth } from '../Contexts/AuthContext';
import Axios from "axios";

const CreateArticlePage = () => {
    const [articleTitle, setArticleTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const { isLoggedIn, user } = useAuth(); // Access logged-in user data


    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
        }
    };
    const [image, setImage] = useState(null);

    const navigate = useNavigate();


    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login'); // Redirect to login page
        }

    }, [isLoggedIn, navigate]);
    const [articleID, setArticleID] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!articleTitle || !description || !price || !image) {
            alert("Please fill in all fields and upload an image");
            return;
        }
        const articleData = new FormData();
        const currentDate = new Date().toISOString();
        articleData.append('userID', user.userID);
        articleData.append('articleTitle', articleTitle);
        articleData.append('description', description);
        articleData.append('price', parseFloat(price));
        articleData.append('dateAdded', currentDate);
        articleData.append('state','uploaded')
        Axios.post('http://34.251.202.114:8080/api/v1/articles', articleData, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            console.log('Response: ',res)
            console.log('Article ID:', res.data.article.articleID);
            setArticleID(res.data.article.articleID)
            const photoData = new FormData();
            if (!image){
                console.log("No image uploaded")
            }
            console.log(image)
            photoData.append('articleID', res.data.article.articleID);
            photoData.append('image', image);

            Axios.post('http://34.251.202.114:8080/api/v1/photos', photoData, {
                headers: {
                    'Content-Header': 'value',
                },
            }).then(res => {
                console.log(res.data)
            });
        }).catch((err) => {console.log(err)})
        navigate('/');
    };
    return (
        <div>
            <h1>Create New Article</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Article Title:</label>
                    <input
                        type="text"
                        value={articleTitle}
                        onChange={(e) => setArticleTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>Price:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                <div>
                    <label>Image:</label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                    />
                </div>
                <button type="submit">Create Article</button>
            </form>
        </div>
    );
};

export default CreateArticlePage;