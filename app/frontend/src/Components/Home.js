import React, { useEffect, useState } from 'react';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { getArticlePhotos, getArticles } from '../services/articleService';
import { createTaskLog } from '../services/logService';
import './home.css';

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [startTime, setStartTime] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        getArticles()
            .then(async response => {
                console.log('Fetched articles:', response);
                if (response && response.article) {
                    const articlesWithPhotos = await Promise.all(response.article.map(async (article) => {
                        const photosResponse = await getArticlePhotos(article.articleID);
                        if (photosResponse && photosResponse.photos && photosResponse.photos[0]) {
                            const photoData = photosResponse.photos[0].image.data;
                            const uint8Array = new Uint8Array(photoData);
                            const blob = new Blob([uint8Array], { type: 'image/png' });
                            const reader = new FileReader();
                            return new Promise((resolve) => {
                                reader.onloadend = () => {
                                    article.imageUrl = reader.result;
                                    resolve(article);
                                };
                                reader.readAsDataURL(blob);
                            });
                        }
                        return article;
                    }));
                    setArticles(articlesWithPhotos);
                } else {
                    console.error('No articles data found');
                }
            })
            .catch(error => {
                console.error('Error fetching articles:', error);
            });
    }, []);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleInputFocus = () => {
        setStartTime(Date.now());
    };

    const handleArticleClick = async (articleID) => {
        const endTime = Date.now();
        const timeTaken = (endTime - startTime) ;
        if (startTime){
            await createTaskLog({
                taskID: 4,
                timeTaken: timeTaken,
            });
        }
    };

    const filteredArticles = articles.filter(article =>
        article.articleTitle.toLowerCase().includes(inputValue.toLowerCase()) && article.state === "uploaded"
    );

    return (
        <div className="app">
            <Header handleInputChange={handleInputChange} handleInputFocus={handleInputFocus} />
            <div className="product-grid">
                {filteredArticles.map((article, index) => (
                    <ProductCard key={article.articleID} article={article} onClick={() => handleArticleClick(article.articleID)} />
                ))}
            </div>
            <BottomNav />
        </div>
    );
}

function Header({ handleInputChange, handleInputFocus }) {
  const input = document.getElementById("search-bar")
  const searchButton = document.getElementById("button")
    return (
        <div className="header">
            <h1 className='title'>Circular Market System</h1>
            <input type="text" className="search-bar" onFocus={handleInputFocus} onChange={handleInputChange} placeholder="Search" />
            {/* <button className="search-button">🔍</button> */}
        </div>
    );
}

function ProductCard({ article, onClick }) {
  const navigate = useNavigate()
    return (
        <div className='product-card' onClick={() => navigate(`/articles/${article.articleID}`)}>
            {article.imageUrl ? (
                <img src={article.imageUrl} alt={article.articleTitle} />
            ) : (
                <div className="product-image-placeholder">🖼️</div>
            )}
            <div className='product-info'>
                <p className='product-name'>{article.articleTitle}</p>
                <p className='product-price'>Price: £{article.price}</p>
            </div>
            <button className='favorite-button'>❤</button>
        </div>
    );
}

function BottomNav() {
    const navigate = useNavigate();
    return (
        <div className="bottom-nav">
            <button className="nav-button" onClick={() => navigate('/')}>🏠</button>
            <button className="nav-button" onClick={() => navigate('/CreateArticlePage')}>➕</button>
            <button className="nav-button">👤</button>
        </div>
    );
}

export default Home;