import {url} from "../Config/config";
import axios from "axios";

async function createArticle(articleData) {
    if (articleData == null) {
        throw new Error("Article data missing!");
    }

    try {
        return await axios.post(`${url}articles`, articleData, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function getArticles() {
    try {
        const response = await fetch(`${url}articles`);
        const data = await response.json();

        if (!data) {
            throw new Error("No articles found or data missing!");
        }

        return data;
    } catch (error) {
        console.log('Error fetching articles:', error);
        throw error;
    }
}

async function getUnsoldArticles() {
    try {
        const response = await fetch(`${url}articles/unsold`);
        const data = await response.json();

        if (!data) {
            throw new Error("No articles found or data missing!");
        }

        return data;
    } catch (error) {
        console.log('Error fetching articles:', error);
        throw error;
    }
}

async function getArticle(articleID) {
    try {
        const response = await fetch(`${url}articles/${articleID}`);
        const data = await response.json();

        if (!data) {
            throw new Error("No articles found or data missing!");
        }

        return data;
    } catch (error) {
        console.log('Error fetching articles:', error);
        throw error;
    }
}

async function getArticlePhotos(articleID) {
    try {
        const response = await fetch(`${url}articles/${articleID}/photos`);
        const data = await response.json();

        if (!data) {
            throw new Error("No photos found or data missing!");
        }

        return data;
    } catch (error) {
        console.log('Error fetching articles:', error);
        throw error;
    }
}

async function getArticlePhoto(articleID) {
    try {
        const response = await fetch(`${url}articles/${articleID}/photo`);
        const data = await response.json();

        if (!data) {
            throw new Error("No photos found or data missing!");
        }

        return data;
    } catch (error) {
        console.log('Error fetching articles:', error);
        throw error;
    }
}

async function deleteArticle(articleID) {
    const requestOptions = {
        method: 'DELETE',
    };

    try {
        const response = await fetch(`${url}articles/${articleID}`, requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return { message: 'Article deleted successfully' };
    } catch (error) {
        console.error('Error deleting article:', error);
        throw error;
    }
}

async function getArticleByOrderId(orderID) {
    const requestOptions = {
        method: 'GET',
    };
    try {
        const response = await fetch(`${url}orders/${orderID}/article`, requestOptions);
        if (!response.ok) {
            console.error('Error:', response);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (!data) {
            throw new Error("No articles found or data missing!");
        }

        return data;
    } catch (error) {
        console.log('Error fetching articles:', error);
        throw error;
    }
}
async function publishReview(reviewData) {
    if (!reviewData) {
        throw new Error("Review data missing!");
    }
    console.log(reviewData)
    try {
        console.log("TEST")
        const response = await axios.post(`${url}reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!data) {
            throw new Error("No review data returned!");
        }

        return data;
    } catch (error) {
        console.error("Error submitting review:", error);
        throw error;
    }
}
export { createArticle, getArticles, getArticle, getArticlePhotos,getArticlePhoto, deleteArticle, getUnsoldArticles, publishReview, getArticleByOrderId };