import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArticle } from '../services/articleService'; // Adjust the path as needed

const ArticleDetails = () => {
    const { articleID } = useParams();
    const [article, setArticle] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const articleData = await getArticle(articleID);
                setArticle(articleData.article); // Assuming the response has an `article` object
            } catch (error) {
                console.error('Error fetching article details:', error);
            }
        };

        fetchArticle();
    }, [articleID]);

    if (!article) return <div>Loading...</div>;

    return (
        <div>
            <h1>{article.articleTitle}</h1>
            <p>{article.description}</p>
            <p>Price: ${article.price}</p>
            <p>Status: {article.state}</p>
        </div>
    );
};

export default ArticleDetails;
