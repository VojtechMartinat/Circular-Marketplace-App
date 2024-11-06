// ItemList.js
import React from 'react';
import './ItemList.css';

function ItemList({ items }) {
  return (
    <div className="item-list">
      <h3>All items</h3>
      <div className="items-grid">
        {items.map((item, index) => (
          <div className="item" key={index}>
            <div className="item-image">
              <span>🖼️</span>
            </div>
            <div className="item-info">
              <p className="item-title">{item.title}</p>
              <p className="item-price">{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ItemList;
