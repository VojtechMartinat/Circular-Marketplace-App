import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { getArticlePhoto, getUnsoldArticles } from '../services/articleService';
import { createTaskLog } from '../services/logService';
import './home.css';



function Home() {
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [priceOrder, setPriceOrder] = useState('asc'); // New state to handle price sorting

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);




const Home = () => {
    const [articles, setArticles] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [startTime, setStartTime] = useState(null);
   

    useEffect(() => {
        getUnsoldArticles()
            .then(async response => {
                if (response && response.article) {
                    const articlesWithPhotos = await Promise.all(response.article.map(async (article) => {
                        const photosResponse = await getArticlePhoto(article.articleID);
                        console.log('Fetched photos:', photosResponse);
                        if (photosResponse && photosResponse.photo){
                            const photoData = photosResponse.photo.image.data;
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


  // Sort products by price
  const sortedProducts = [...sampleProducts].sort((a, b) => {
    const priceA = parseFloat(a.price.replace('$', '').replace(',', ''));
    const priceB = parseFloat(b.price.replace('$', '').replace(',', ''));


    return priceOrder === 'asc' ? priceA - priceB : priceB - priceA;
  });

  // Filter products based on search
  const filteredProducts = sortedProducts.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      {/* Centered Search & Dark Mode Toggle */}
      <section className="hero-section">
        <div className="search-group">
          <input
            type="text"
            className="search-bar"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="dark-mode-toggle inline-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Price Order Dropdown */}
        <select
          className="price-order"
          value={priceOrder}
          onChange={(e) => setPriceOrder(e.target.value)}
        >
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>

        <div className="slogan">
          <p className="line1">Give it a second life.</p>
          <p className="line2">Help your unused stuffs find a new home.</p>
        </div>
      </section>

      {/* Product Grid */}
      <main className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <button className="favorite-button">❤️</button>
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="product-image-placeholder">No Image</div>
              )}
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-price">{product.price}</div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            No products found.
          </p>
        )}
      </main>
    </div>
  );



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
                    <p className='product-name'>
                        {article.articleTitle}
                    </p>
                <p className='product-price'>Price: £{article.price}</p>
            </div>
            <button className='favorite-button'>❤</button>
        </div>
    );
}



}

export default Home;