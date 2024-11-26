
import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import {createArticle} from "../services/articleService";
import {createPhoto, uploadPhoto} from "../services/photoService";
import './AddItem.css';


const CreateArticlePage = () => {
    const [articleTitle, setArticleTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const { isLoggedIn, user } = useAuth(); // Access logged-in user data
    const [isShipping, setIsShipping] = useState(false);
    const [isCollection, setIsCollection] = useState(true);
    const [images, setImages] = useState([]); // State for the uploaded image
    const maxImages = 5;
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login'); // Redirect to login page
        }
    }, [isLoggedIn, navigate]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
        }
    };
    const [image, setImage] = useState(null);



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
        createArticle(articleData).then((res) => {
            const photoData = new FormData();
            if (!image){
                console.log("No image uploaded")
            }
            photoData.append('articleID', res.data.article.articleID);
            photoData.append('image', image);

            createPhoto(photoData).then(res => {
            }).catch(err => {
                throw new Error(err)
                }
            )

        }).catch((err) => {
            console.log(err)
            alert("Error creating an article!")
        })
    };
    return (
        <div className="add-item">
            <header className="header">
                <button className="back-button" onClick={() => navigate('/')}>←</button>
                <h1>Add</h1>
                <button className="ai-suggest-button">AI-Suggest</button>
            </header>

            <form onSubmit={handleSubmit}>


                <div className="input-group">
                    <label>Title</label>
                    <input
                        type="text"
                        placeholder="Add a title "
                        value={articleTitle}
                        onChange ={(e) => setArticleTitle(e.target.value)}/>
                </div>

                <div className="input-group">
                    <label>Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <label>Price</label>
                    <input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="£ Free or enter amount"
                    />
                </div>

                <div className="shipping-options">
                    <button
                        className={`option-button ${isShipping ? 'selected' : ''}`}
                        onClick={() => setIsShipping(!isShipping)}>
                        Shipping
                    </button>
                    <button
                        className={`option-button ${isCollection ? 'selected' : ''}`}
                        onClick={() => setIsCollection(!isCollection)}>
                        Collection
                    </button>
                    <div className="cost-info">Cost: £2.00</div>
                </div>

                <button className="publish-button">
                    Publish for £2.20<br />
                    <span className="subtext">Including shipping & buyer protection</span>
                </button>
            </form>
        </div>
    );
};
export default CreateArticlePage;
