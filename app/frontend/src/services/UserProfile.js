import React from 'react';
import './UserProfile.css';

function UserProfile() {
  return (
    <div className="user-profile">
      <header className="profile-header">
        <button className="back-button">←</button>
        <div className="icons">
          <button className="icon">⬆️</button>
          <button className="icon">⚙️</button>
        </div>
      </header>

      <div className="profile-section">
        <div className="profile-picture">
          <span role="img" aria-label="user-icon">👤</span>
        </div>
        <h2 className="profile-name">Marius</h2>
        <p className="rating">★★★★★ (6)</p>
      </div>

      <div className="wallet-section">
        <span>My Wallet</span>
        <span>£10.00</span>
      </div>

      <div className="menu">
        <div className="menu-item">
          <span>Wishlist</span>
          <span role="img" aria-label="heart">❤️</span>
        </div>
        <div className="menu-item">
          <span>Buying</span>
          <span>→</span>
        </div>
        <div className="menu-item">
          <span>Selling</span>
          <span>→</span>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
