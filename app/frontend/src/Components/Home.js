import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../services/articleService'; // Adjust path as necessary

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        getArticles()
            .then(response => {
                console.log('Fetched articles:', response);
                if (response && response.article) {
                    setArticles(response.article); // Update with correct structure
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

    return (
        <div>
            <h1>Welcome to Circular MarketPlace App</h1>

            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter something..."
            />
            <p>You entered: {inputValue}</p>

            {articles.map(article => (
                <div key={article.articleID}>
                    <Link to={`/articles/${article.articleID}`}>
                        <h2>{article.articleTitle}</h2>
                    </Link>
                    <p></p>
                    <p>Price: ${article.price}</p>
                </div>
            ))}
        </div>
    );
};

export default Home;
