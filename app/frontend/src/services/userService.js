const userAPI = 'http://34.251.202.114:8080/api/v1/'

// services/userService.js
async function loginUser(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    };

    const response = await fetch(`${userAPI}login`, requestOptions);

    if (!response.ok) {
        throw new Error('Login failed');
    }

    return await response.json(); // Assuming it returns user data
}


async function createUser(userData) {
    const data = userData;
    if (userData == null){
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
        const response = await fetch(`${userAPI}users`, requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function getUserArticles(userID){
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }

    try {
        const response = await fetch(`${userAPI}users/${userID}/articles`, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function getUserOrders(userID){
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }

    try {
        const response = await fetch(`${userAPI}users/${userID}/orders`, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


module.exports = {createUser,getUserArticles,getUserOrders, loginUser}