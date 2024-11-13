import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle } from '../services/articleService';
import { uploadPhoto } from '../services/photoService'; // Import the uploadPhoto service
import './AddItem.css';

function AddItem() {
  const [price, setPrice] = useState('');
  const [isShipping, setIsShipping] = useState(false);
  const [isCollection, setIsCollection] = useState(true);
  const [articleTitle, setArticleTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]); // State for the uploaded image
  const navigate = useNavigate();
  const maxImages = 5;

  const handleImageChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      // Create a new image array with the uploaded image
      const newImages = [...images];
      newImages[index] = file; // Store the image URL
      setImages(newImages); // Update the state with the new image list
    }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();

      if (!articleTitle || !description || !price || images.length == 0) {
          alert("Please fill in all fields and upload an image.");
          return;
      }

      try {
          // Create article first
          const articleData = {
              articleTitle,
              description,
              price: parseFloat(price),
              dateAdded: new Date(),
              state: 'uploaded',
          };

          const articleResponse = await createArticle(articleData); // Create the article in the DB
          console.log(articleResponse)

          // Upload the photo
          for (let i = 0; i < images.length; i++) {
            const photoData = new FormData();
            const file = images[i];
            photoData.append('image', file);
            photoData.append('articleID', articleResponse.articleID); // Attach the article ID

            await uploadPhoto(photoData); // Upload the photo and associate with the article
          } // Upload the photo and associate with the article

          // Redirect to home or another page
          navigate('/');
      } catch (error) {
          console.error('Error creating article and uploading photo:', error);
          alert('Failed to create article or upload photo');
      }
  };
  
  const renderPhotoBox = (index) => {
    return (
      <div className="photo-box" key={index}>
        {images[index] ? (
          <img src={URL.createObjectURL(images[index])} alt={`Uploaded ${index}`} className="image-preview" />
        ) : (
          index === images.length && images.length < maxImages && (
            <label htmlFor={`image-upload-${index}`} className="upload-label">+</label>
          )
        )}
        <input
          type="file"
          accept="image/*"
          id={`image-upload-${index}`}
          onChange={(e) => handleImageChange(e, index)}
          style={{ display: 'none' }}
        />
      </div>
    );
  };

  return (
    <div className="add-item">
      <header className="header">
        <button className="back-button" onClick={() => navigate('/')}>←</button>
        <h1>Add</h1>
        <button className="ai-suggest-button">AI-Suggest</button>
      </header>

      <form onSubmit={handleSubmit}>
      <div className="photo-section">
          {Array.from({ length: maxImages }, (_, index) => renderPhotoBox(index))}
        </div>

        <div className="input-group">
          <label>Title</label>
          <input 
              type="text" 
              placeholder="Add a title " 
              value={articleTitle}
              onChange ={(e) => setArticleTitle(e.target.value)}/>
        </div>

        <div className="input-group">
          <label>Description</label>
          <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
                    />
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
      </form>
    </div>
  );
}

export default AddItem;
