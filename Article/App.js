// App.js
import React from "react";
import "./App.css";

function App() {
  return (
    <div className="app">
      {/* Header section */}
      <div className="header">
        <button className="back-button">←</button>
        <div className="icons">
          <button className="icon-button">❤</button>
          <button className="icon-button">⇧</button>
          <button className="icon-button">⋮</button>
        </div>
      </div>

      {/* Image placeholder */}
      <div className="image-placeholder">
        <img src="/placeholder-image.png" alt="Product" />
      </div>

      {/* Title and description */}
      <div className="details">
        <h2 className="title">Title</h2>
        <p className="description">
          XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
          XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
          XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        </p>
      </div>

      {/* Seller section */}
      <div className="seller-info">
        <div className="seller-avatar">👤</div>
        <div className="seller-details">
          <p className="seller-name">Name of Seller</p>
          <p className="seller-rating">★★★★★ (4)</p>
        </div>
        <div className="seller-location">📍 Bristol</div>
      </div>

      {/* Shipping and Collection */}
      <div className="purchase-options">
        <div className="option shipping">
          <p>Shipping</p>
        </div>
        <div className="option collection">
          <p>Collection</p>
        </div>
      </div>

      {/* Purchase Button */}
      <div className="purchase-button">
        <button>Buy for £10 including money-back guarantee</button>
      </div>
    </div>
  );
}

export default App;
