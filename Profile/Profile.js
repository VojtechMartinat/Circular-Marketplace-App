// Profile.js
import React from 'react';
import { FaArrowLeft, FaShareSquare } from 'react-icons/fa';
import './Profile.css';

function Profile({ name, rating }) {
  return (
    <div className="profile-container">
      <div className="profile-header">
        <FaArrowLeft className="icon" />
        <FaShareSquare className="icon" />
      </div>
      <div className="profile-info">
        <div className="profile-picture">
          <span className="profile-icon">👤</span>
        </div>
        <h2 className="profile-name">{name}</h2>
        <p className="profile-rating">***** ({rating})</p>
      </div>
    </div>
  );
}

export default Profile;
