import React, { useEffect, useState } from 'react';
import {useNavigate } from 'react-router-dom';
import {getArticlePhoto, getPhotosForArticleIds, getUnsoldArticles} from '../services/articleService';
import { createTaskLog } from '../services/logService';
import './home.css';
import { FaMoon, FaRegSun, FaHeart} from "react-icons/fa6";

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [theme, setTheme] = useState('light');
    const [loading, setLoading] = useState(true);
    const [photoBatchIndex, setPhotoBatchIndex] = useState(0);
    const batchSize = 1;
    const [articlesWithPhotos, setArticlesWithPhotos] = useState([]);
    const [sortOrder, setSortOrder] = useState('low-to-high');

    useEffect(() => {
        getUnsoldArticles()
            .then(response => {
                if (response && response.article) {
                    setArticles(response.article);
                    setArticlesWithPhotos(response.article.map(article => ({ ...article, imageUrl: null })));
                }
            })
            .catch(error => {
                console.error('Error fetching articles:', error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const fetchPhotos = async () => {
            if (articles) {
                articlesWithPhotos.forEach(async (article) => {
                    const retryFetchPhoto = async (retries = 3, delay = 1000) => {
                        for (let attempt = 1; attempt <= retries; attempt++) {
                            try {
                                const photoResponse = await getArticlePhoto(article.articleID);
                                if (photoResponse?.photo?.image?.data) {
                                    const photoData = photoResponse.photo.image.data;
                                    const uint8Array = new Uint8Array(photoData);
                                    const blob = new Blob([uint8Array], { type: 'image/png' });
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setArticlesWithPhotos(prevArticles => prevArticles.map(a =>
                                            a.articleID === article.articleID ? { ...a, imageUrl: reader.result } : a
                                        ));
                                    };
                                    reader.readAsDataURL(blob);
                                    break; // Exit loop if successful
                                }
                            } catch (error) {
                                if (attempt < retries) {
                                    console.warn(`Retrying fetch photo for article ${article.articleID}, attempt ${attempt}`);
                                    await new Promise(resolve => setTimeout(resolve, delay));
                                } else {
                                    console.error(`Failed to fetch photo for article ${article.articleID} after ${retries} attempts`);
                                }
                            }
                        }
                    };

                    await retryFetchPhoto();
                });
            }
        };

        fetchPhotos();
    }, [articles]);

    // useEffect(() => {
    //     if (articles.length > 0) {
    //         loadNextPhotoBatch();
    //     }
    // }, [photoBatchIndex, articles]);

    // const loadNextPhotoBatch = async () => {
    //     const start = photoBatchIndex * batchSize;
    //     const end = start + batchSize;
    //     const batch = articles.slice(start, end);
    //
    //     if (batch.length === 0) return;
    //
    //     try {
    //         const articleIds = batch.map(article => article.articleID);
    //         const photosResponse = await getPhotosForArticleIds(articleIds);
    //
    //         const updatedArticles = await Promise.all(articlesWithPhotos.map(async (article) => {
    //             if (photosResponse[article.articleID]) {
    //                 const photoData = photosResponse[article.articleID].image.data;
    //                 const uint8Array = new Uint8Array(photoData);
    //                 const blob = new Blob([uint8Array], { type: 'image/png' });
    //                 const reader = new FileReader();
    //
        //                 return new Promise(resolve => {
        //                     reader.onloadend = () => resolve({ ...article, imageUrl: reader.result });
        //                     reader.readAsDataURL(blob);
        //                 });
    //             }
    //             return article;
    //         }));
    //
    //         setArticlesWithPhotos(updatedArticles);
    //     } catch (error) {
    //         console.error('Error fetching photos:', error);
    //     }
    // };

    const handleThemeToggle = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const handleSortChange = (order) => {
        setSortOrder(order);
    };

    const sortedArticles = [...articlesWithPhotos].sort((a, b) => {
        if (sortOrder === 'low-to-high') return a.price - b.price;
        if (sortOrder === 'high-to-low') return b.price - a.price;
        if (sortOrder === 'az') return a.articleTitle.localeCompare(b.articleTitle);
        if (sortOrder === 'za') return b.articleTitle.localeCompare(a.articleTitle);
        return 0;
    });

    const filteredArticles = sortedArticles.filter(article =>
        article.articleTitle.toLowerCase().includes(inputValue.trim().toLowerCase()) &&
        article.state === "uploaded"
    );

    return (
        <div className={`app ${theme}`}>
            <Header
                handleInputChange={(e) => setInputValue(e.target.value)}
                handleThemeToggle={handleThemeToggle}
                handleSortChange={handleSortChange}
                theme={theme}
            />
            <div className="product-grid">
                {filteredArticles.map(article => (
                    <ProductCard key={article.articleID} article={article} />
                ))}
            </div>
        </div>
    );
};

function Header({ handleInputChange, handleThemeToggle, handleSortChange, theme }) {
    return (
        <div className="header">
            <div className="search-container">
                <input type="text" className="search-bar" onChange={handleInputChange} placeholder="Search items..." />
                <select className="sort-dropdown" onChange={(e) => handleSortChange(e.target.value)}>
                    <option value="low-to-high">Price: Low to High</option>
                    <option value="high-to-low">Price: High to Low</option>
                    <option value="az">Alphabet: A-Z</option>
                    <option value="za">Alphabet: Z-A</option>
                </select>
            </div>

            <div className="header-buttons">
                <button className="theme-toggle-button" onClick={handleThemeToggle}>
                    {theme === 'dark' ? <FaRegSun /> : <FaMoon />}
                    {theme === 'dark' ? " Light Mode" : " Dark Mode"}
                </button>
            </div>

            <p className="slogan">Give it a second life.<br /> Help your unused stuff find a new home.</p>
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
