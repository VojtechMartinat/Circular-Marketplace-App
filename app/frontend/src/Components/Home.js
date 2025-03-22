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
    const [priceOrder, setPriceOrder] = useState('low-to-high');
    const [theme, setTheme] = useState('light'); // New state to track the theme

    useEffect(() => {
        getUnsoldArticles()
            .then(async response => {
                if (response && response.article) {
                    const articleIds = response.article.map(article => article.articleID);

                    if (Array.isArray(articleIds) && articleIds.length > 0) {
                        try {
                            const photosResponse = await getPhotosForArticleIds(articleIds);

                            const articlesWithPhotos = response.article.map((article) => {
                                const photo = photosResponse[article.articleID];
                                if (photo && photo.image) {
                                    const photoData = photo.image.data;
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
                            });

                            const resolvedArticles = await Promise.all(articlesWithPhotos);
                            setArticles(resolvedArticles);
                        } catch (error) {
                            console.error('Error fetching photos:', error);
                        }
                    } else {
                        console.error("Invalid articleIds:", articleIds);
                    }
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
        if (!startTime) return;
        const timeTaken = Date.now() - startTime;

        await createTaskLog({
            taskID: 4,
            timeTaken,
        });
    };

    const handlePriceOrderChange = (event) => {
        setPriceOrder(event.target.value);
    };

    const handleThemeToggle = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');  // Toggle between light and dark themes
    };

    const sortedArticles = [...articles].sort((a, b) => {
        if (priceOrder === 'low-to-high') {
            return a.price - b.price;
        } else if (priceOrder === 'high-to-low') {
            return b.price - a.price;
        }
        return 0;
    });

    const filteredArticles = sortedArticles.filter(article =>
        article.articleTitle.toLowerCase().includes(inputValue.trim().toLowerCase()) &&
        article.state === "uploaded"
    );

    return (
        <div className={`app ${theme}`}> {/* Apply the theme dynamically */}
            <Header 
                handleInputChange={handleInputChange} 
                handleInputFocus={handleInputFocus} 
                handlePriceOrderChange={handlePriceOrderChange}
                handleThemeToggle={handleThemeToggle}  // Pass down the new handler
            />
            <div className="product-grid">
                {filteredArticles.map(article => (
                    <ProductCard 
                        key={article.articleID} 
                        article={article} 
                        onClick={() => handleArticleClick(article.articleID)} 
                    />
                ))}
            </div>
        </div>
    );
};

function Header({ handleInputChange, handleInputFocus, handlePriceOrderChange, handleThemeToggle, theme }) {
    return (
        <div className="header">
            <div className="search-container">
                <input 
                    type="text" 
                    className="search-bar" 
                    onFocus={handleInputFocus} 
                    onChange={handleInputChange} 
                    placeholder="Search items..." 
                />
                <div className="header-buttons">
                    <select className="price-order-select" onChange={handlePriceOrderChange}>
                        <option value="low-to-high">Price: Low to High</option>
                        <option value="high-to-low">Price: High to Low</option>
                    </select>
                    <button className="theme-toggle-button" onClick={handleThemeToggle}>
                        {theme === 'dark' ? (
                            <> <FaRegSun /> Light Mode </>
                        ) : (
                            <> <FaMoon />  Dark / <FaRegSun /> Light  </>
                        )}
                    </button>
                </div>
                <p className="slogan">Give it a second life.<br /> Help your unused stuff find a new home.</p>
            </div>
        </div>
    );
}

function ProductCard({ article, onClick }) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        onClick();
        navigate(`/articles/${article.articleID}`);
    };

    return (
        <div className="product-card" onClick={handleCardClick}>
            {article.imageUrl ? (
                <img src={article.imageUrl} alt={article.articleTitle} />
            ) : (
                <div className="product-image-placeholder"><FaFileImage /></div>
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
