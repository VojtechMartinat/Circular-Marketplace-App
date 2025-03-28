import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPhotosForArticleIds, getUnsoldArticles } from '../services/articleService';
import { createTaskLog } from '../services/logService';
import './home.css';
import { FaMoon, FaRegSun, FaHeart, FaFileImage } from "react-icons/fa6";

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [photoBatchIndex, setPhotoBatchIndex] = useState(0);
    const batchSize = 6;
    const [articlesWithPhotos, setArticlesWithPhotos] = useState([]);
    const [priceOrder, setPriceOrder] = useState('low-to-high');
    const [theme, setTheme] = useState('light'); // Theme state
    const [appMode, setAppMode] = useState(false); // New state for layout mode

    useEffect(() => {
        getUnsoldArticles()
            .then(response => {
                if (response && response.article) {
                    setArticles(response.article);
                    setArticlesWithPhotos(response.article.map(article => ({ ...article, imageUrl: null })));
                    setLoading(false);
                    setPhotoBatchIndex(0);
                }
            })
            .catch(error => {
                console.error('Error fetching articles:', error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (articles.length > 0) {
            loadNextPhotoBatch();
        }
    }, [photoBatchIndex, articles]);

    const loadNextPhotoBatch = async () => {
        const start = photoBatchIndex * batchSize;
        const end = start + batchSize;
        const batch = articles.slice(start, end);

        if (batch.length === 0) return;

        try {
            const articleIds = batch.map(article => article.articleID);
            const photosResponse = await getPhotosForArticleIds(articleIds);

            const updatedArticles = articlesWithPhotos.map(article => {
                if (photosResponse[article.articleID]) {
                    const photoData = photosResponse[article.articleID].image.data;
                    const uint8Array = new Uint8Array(photoData);
                    const blob = new Blob([uint8Array], { type: 'image/png' });
                    const reader = new FileReader();

                    return new Promise(resolve => {
                        reader.onloadend = () => {
                            resolve({ ...article, imageUrl: reader.result });
                        };
                        reader.readAsDataURL(blob);
                    });
                }
                return article;
            });

            const resolvedArticles = await Promise.all(updatedArticles);
            setArticlesWithPhotos(resolvedArticles);

            setTimeout(() => setPhotoBatchIndex(prev => prev + 1), 10);
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    };

    const handleThemeToggle = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const handleModeToggle = () => {
        setAppMode(prevMode => !prevMode);
    };

    const sortedArticles = [...articlesWithPhotos].sort((a, b) => {
        return priceOrder === 'low-to-high' ? a.price - b.price : b.price - a.price;
    });

    const filteredArticles = sortedArticles.filter(article =>
        article.articleTitle.toLowerCase().includes(inputValue.trim().toLowerCase()) &&
        article.state === "uploaded"
    );

    return (
        <div className={`app ${theme} ${appMode ? 'app-mode' : ''}`}>
            <Header
                handleInputChange={(e) => setInputValue(e.target.value)}
                handleThemeToggle={handleThemeToggle}
                handleModeToggle={handleModeToggle} // Pass mode toggle handler
                theme={theme}
                appMode={appMode}
            />
            <div className="product-grid">
                {filteredArticles.map(article => (
                    <ProductCard key={article.articleID} article={article} />
                ))}
            </div>
        </div>
    );
};

function Header({ handleInputChange, handleThemeToggle, handleModeToggle, theme, appMode }) {
    return (
        <div className="header">
            <div className="search-container">
                <input type="text" className="search-bar" onChange={handleInputChange} placeholder="Search items..." />
                <div className="header-buttons">
                    <button className="theme-toggle-button" onClick={handleThemeToggle}>
                        {theme === 'dark' ? <FaRegSun /> : <FaMoon />}
                        {theme === 'dark' ? " Light Mode" : " Dark Mode"}
                    </button>
                    <button className="mode-toggle-button" onClick={handleModeToggle}>
                        {appMode ? "Switch to Desktop Mode" : "Switch to App Mode"}
                    </button>
                </div>
                <p className="slogan">Give it a second life.<br /> Help your unused stuff find a new home.</p>
            </div>
        </div>
    );
}

function ProductCard({ article }) {
    const navigate = useNavigate();

    return (
        <div className="product-card" onClick={() => navigate(`/articles/${article.articleID}`)}>
            {article.imageUrl ? (
                <img src={article.imageUrl} alt={article.articleTitle} />
            ) : (
                <div className="product-image-placeholder">
                    <div className="loading-spinner"></div>
                </div>
            )}
            <div className="product-info">
                <p className="product-name">{article.articleTitle}</p>
                <p className="product-price">Price: £{article.price}</p>
            </div>
            <button className="favorite-button">
                <FaHeart />
            </button>
        </div>
    );
}

export default Home;


export default Home;
