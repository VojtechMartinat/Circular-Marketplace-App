const userAPI = 'http://34.251.202.114:8080/api/v1/'

async function createArticle(articleData) {
    var data = articleData
    if (articleData == null){
        throw new Error("Article data missing!")
    }
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };

    try {
        await fetch(`${userAPI}articles`, requestOptions).then((res) => res.json())
            .then((data) => {
                return data
            });
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function getArticles() {
    const userAPI = 'http://34.251.202.114:8080/api/v1/';
    try {
        const response = await fetch(`${userAPI}articles`);
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
    const userAPI = 'http://34.251.202.114:8080/api/v1/';
    try {
        const response = await fetch(`${userAPI}articles/${articleID}`);
        const data = await response.json();

        if (!data) {
            throw new Error("No articles found or data missing!");
        }

        return data;  // Return article
    } catch (error) {
        console.log('Error fetching articles:', error);
        throw error;  // Re-throw the error to handle it in the calling function
    }
}
async function getArticlePhotos(articleID) {
    const userAPI = 'http://34.251.202.114:8080/api/v1/';
    try {
        const response = await fetch(`${userAPI}articles/${articleID}/photos`);
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
        const response = await fetch(`${userAPI}articles/${articleID}`, requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return { message: 'Article deleted successfully' };
    } catch (error) {
        console.error('Error deleting article:', error);
        throw error;
    }
}

module.exports = {createArticle, getArticles, getArticle,getArticlePhotos, deleteArticle}