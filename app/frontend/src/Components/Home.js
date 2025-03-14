import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArticlePhoto, getUnsoldArticles } from '../services/articleService';
import { createTaskLog } from '../services/logService';
import './home.css';

const sampleProducts = [
  { id: 1, name: 'AirPods Pro', price: '$249', image: 'https://via.placeholder.com/300x300?text=AirPods' },
  { id: 2, name: 'MacBook Air', price: '$999', image: 'https://via.placeholder.com/300x300?text=MacBook' },
  { id: 3, name: 'iPhone 15', price: '$799', image: 'https://via.placeholder.com/300x300?text=iPhone' },
  { id: 4, name: 'Apple Watch', price: '$399', image: 'https://via.placeholder.com/300x300?text=Watch' },
];

function Home() {
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [priceOrder, setPriceOrder] = useState('asc'); // New state to handle price sorting

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

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
}

export default Home;
