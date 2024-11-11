import React, { useState } from 'react';
import './AddItem.css';

function AddItem() {
  const [price, setPrice] = useState('');
  const [isShipping, setIsShipping] = useState(false);
  const [isCollection, setIsCollection] = useState(true);

  return (
    <div className="add-item">
      <header className="header">
        <button className="back-button">←</button>
        <h1>Add</h1>
        <button className="ai-suggest-button">AI-Suggest</button>
      </header>

      <div className="photo-section">
        <div className="photo-box">Photo 1</div>
        <div className="photo-box">Photo 2</div>
        <div className="photo-box add-photo">+</div>
      </div>

      <div className="input-group">
        <label>Title</label>
        <input type="text" placeholder="Stickers" />
      </div>

      <div className="input-group">
        <label>Description</label>
        <textarea placeholder="Enter description here"></textarea>
      </div>

      <div className="input-group">
        <label>Price</label>
        <input 
          type="text" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          placeholder="£ Free or enter amount" 
        />
      </div>

      <div className="shipping-options">
        <button 
          className={`option-button ${isShipping ? 'selected' : ''}`} 
          onClick={() => setIsShipping(!isShipping)}>
          Shipping
        </button>
        <button 
          className={`option-button ${isCollection ? 'selected' : ''}`} 
          onClick={() => setIsCollection(!isCollection)}>
          Collection
        </button>
        <div className="cost-info">Cost: £2.00</div>
      </div>

      <button className="publish-button">
        Publish for £2.20<br />
        <span className="subtext">Including shipping & buyer protection</span>
      </button>
    </div>
  );
}

export default AddItem;
