// App.js
import React from "react";
import "./App.css";

function App() {
  const products = [
    { name: "Helmut", price: "£10" },
    { name: "Chair", price: "£15" },
    { name: "Shirt", price: "Free" },
    { name: "Jacket", price: "Free" },
    { name: "Sion", price: "Free" },
  ];

  return (
    <div className="app">
      <Header />
      <div className="product-grid">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
      <BottomNav />
    </div>
  );
}

function Header() {
  return (
    <div className="header">
      <button className="menu-button">≡</button>
      <input type="text" className="search-bar" placeholder="Search" />
      <button className="search-button">🔍</button>
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-image-placeholder">🖼️</div>
      <div className="product-info">
        <p className="product-name">{product.name}</p>
        <p className="product-price">{product.price}</p>
      </div>
      <button className="favorite-button">❤</button>
    </div>
  );
}

function BottomNav() {
  return (
    <div className="bottom-nav">
      <button className="nav-button">🏠</button>
      <button className="nav-button">➕</button>
      <button className="nav-button">👤</button>
    </div>
  );
}

export default App;
