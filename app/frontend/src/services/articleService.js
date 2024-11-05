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
        const response = await fetch(`${userAPI}articles`, requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

x = createArticle().then(x => console.log(x))
module.exports = createArticle()

