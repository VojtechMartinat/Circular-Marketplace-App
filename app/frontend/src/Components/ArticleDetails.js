import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArticle, getArticlePhotos } from '../services/articleService'; // Adjust the path as needed

const ArticleDetails = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [imageUrl, setImageUrl] = useState(null); // State to store image URL

    useEffect(() => {
        getArticle(id).then(response => {
            if (response) {
                setArticle(response.article);
            }
        });
    }, [id]);

    useEffect(() => {
        getArticlePhotos(id).then(response => {
            console.log("Article photos response:", response);
            if (response && response.photos && response.photos[0]) {
                const photoData = response.photos[0].image.data;

                // Convert the Buffer data to a base64 string using FileReader
                const uint8Array = new Uint8Array(photoData);
                const blob = new Blob([uint8Array], { type: 'image/png' }); // assuming image is PNG
                const reader = new FileReader();

                reader.onloadend = () => {
                    setImageUrl(reader.result); // Base64 URL
                };

                reader.readAsDataURL(blob); // This will trigger the onloadend function
            }
        });
    }, [id]);

    // If article or imageUrl is not available, show loading
    if (!article) return <div>Loading...</div>;

    return (
        <div>
            <h1>{article.articleTitle}</h1>
            {imageUrl ?
                <img
                    src={imageUrl}
                    alt="Article"
                    onLoad={() => console.log('Image loaded successfully!')}
                />
                : <p> No photo found</p>
            }
            <p>{article.description}</p>
            <p>Price: ${article.price}</p>
            <p>Status: {article.state}</p>
        </div>
    );
};

export default ArticleDetails;
