import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {getArticlePhotos, getArticles} from '../services/articleService';
import './home.css'

function App() {
  const [articles, setArticles] = useState([]);
  const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        getArticles()
            .then(async (response) => {
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

  const filteredArticles = articles.filter(article =>
    article.articleTitle.toLowerCase().includes(inputValue.toLowerCase())
  )

  // const products = [
  //     { name: "Helmut", price: "£10" },
  //     { name: "Chair", price: "£15" },
  //     { name: "Shirt", price: "Free" },
  //     { name: "Jacket", price: "Free" },
  //     { name: "Sion", price: "Free" },
  // ];

  return (
    <div className="app">
      <Header handleInputChange={handleInputChange} />
      <div className="product-grid">
        {filteredArticles.map((article, index)=>(
          <ProductCard key={article.articleID} article={article}/>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}

function Header({handleInputChange}) {
  return (
    <div className="header">
      <h1 className='title'>Circular Market System</h1>
      <input type="text" className="search-bar" onChange = {handleInputChange} placeholder="Search" />
      <button className="search-button">🔍</button>
    </div>
  );
}

function ProductCard({ article }) {
  return (
    <div className='product-card'>
        {article.imageUrl ? (
            <img src={article.imageUrl} alt={article.articleTitle} />
        ) : (
            <div className="product-image-placeholder">🖼️</div>
        )}
      <div className='product-info'>
      <Link to ={`/articles/${article.articleID}`}>
        <p className='product-name'>
          {article.articleTitle}
        </p>
      </Link>
      <p classname='product-price'>Price: {article.price}</p>
      </div>
      <button className='favorite-button'>❤</button>
    </div>
  )

  //   <div className="product-card">
  //     <Link to={`/articles/${article.articleID}`}>
  //     <div className="product-image-placeholder">🖼️</div>
  //     <div className="product-info">
  //       <p className="product-name">{product.name}</p>
  //       <p className="product-price">{product.price}</p>
  //     </div>
  //     <button className="favorite-button">❤</button>
  //     </Link>
  //   </div>
  // );
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

export default App;
