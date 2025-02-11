import {url} from "../Config/config"

async function loginUser(username, password) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };

    try {
        const response = await fetch(`${url}users`, requestOptions);

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        const result = await response.json();


        const users = result.users || result;

        if (!Array.isArray(users)) {
            throw new Error('Unexpected response format, users is not an array');
        }

        const user = users.find((user) => user.username === username && user.password === password);

        if (!user) {
            throw new Error('Invalid username or password');
        }

        return {
            userID: user.userID,
            username: user.username,
            email: user.email,
            location: user.location,
            wallet: user.wallet,
        };

    } catch (error) {
        console.error('Login failed:', error.message);
        throw new Error('Login failed. Please try again.');
    }
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
        const response = await fetch(`${url}users`, requestOptions);

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
        const response = await fetch(`${url}users/${userID}/articles`, requestOptions);
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
        const response = await fetch(`${url}users/${userID}/orders`, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function getUser(userID){
    const  requestOptions = {
        method: 'GET',
        headers : {
            'Content-Type': 'application/json',
        },
    }
    try{
        const response = await fetch(`${url}users/${userID}`,requestOptions)
        if (!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json()
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export {createUser,getUserArticles,getUserOrders,loginUser,getUser}