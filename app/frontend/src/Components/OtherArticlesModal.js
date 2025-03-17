import React, { useEffect } from 'react';
import './otherArticlesModal.css';
import { FaXmark } from "react-icons/fa6";

const OtherArticlesModal = ({ userArticles, onClose, onViewArticle }) => {
    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            onClose();
        }
    };


    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, );

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>All Articles</h3>
                    <button className="close-button" onClick={onClose}>
                        <FaXmark size={30}/>
                    </button>
                </div>
                <div className="modal-body">
                    {userArticles.length > 0 ? (
                        <div className="articles-list">
                            {userArticles.map((userArticle) => (
                                <div
                                    className="article-item"
                                    key={userArticle.articleID}
                                    onClick={() => onViewArticle(userArticle.articleID)}
                                >
                                    <img
                                        src={userArticle.imageUrl || 'default_image.png'}
                                        alt={userArticle.articleTitle}
                                        className="article-image"
                                    />
                                    <div className="article-info">
                                        <h4>{userArticle.articleTitle}</h4>
                                        <p>£{userArticle.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No articles available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OtherArticlesModal;
