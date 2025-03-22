import React, { useEffect, useState } from 'react';
import {useNavigate } from 'react-router-dom';
import {getPhotosForArticleIds, getUnsoldArticles} from '../services/articleService';
import { createTaskLog } from '../services/logService';
import './home.css';


const Home = () => {
    const [articles, setArticles] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [startTime, setStartTime] = useState(null);

    const [loading, setLoading] = useState(true);
    const [photoBatchIndex, setPhotoBatchIndex] = useState(0);
    const batchSize = 6;
    const [articlesWithPhotos, setArticlesWithPhotos] = useState([]);
    useEffect(() => {
        // Fetch the unsold articles
        getUnsoldArticles()
            .then(response => {
                if (response && response.article) {
                    setArticles(response.article);
                    setArticlesWithPhotos(response.article.map(article => ({ ...article, imageUrl: null })));
                    setLoading(false);
                    setPhotoBatchIndex(0); // Start loading photos from batch 0
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

        if (batch.length === 0) return; // Stop if there are no more articles

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

            // Load the next batch after a short delay
            setTimeout(() => setPhotoBatchIndex(prev => prev + 1), 1000);
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    };



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
            {loading ? (
                <div className="loading-spinner">Loading articles...</div>
            ) : (
                <div className="product-grid">
                    {articlesWithPhotos.map(article => (
                        <ProductCard key={article.articleID} article={article} onClick={() => handleArticleClick(article.articleID)} />
                    ))}
                </div>
            )}
        </div>
    );
}

function Header({ handleInputChange, handleInputFocus }) {
    return (
        <div className="header">
            <p className='title'>ReList</p>
            <input type="text" className="search-bar" onFocus={handleInputFocus} onChange={handleInputChange} placeholder="Search" />
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
                <div className="product-image-placeholder">
                    <div className="loading-spinner"></div>
                </div>
            )}
            <div className='product-info'>
                <p className='product-name'>{article.articleTitle}</p>
                <p className='product-price'>Price: £{article.price}</p>
            </div>
            <button className='favorite-button'>❤</button>
        </div>
    );
}




export default Home;