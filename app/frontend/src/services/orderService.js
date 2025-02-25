import {url} from "../Config/config"
import Axios from "axios";


async function createOrder(orderData) {
    if (orderData == null){
        throw new Error("Article data missing!")
    }
    try {
        Axios.post(`${url}orders`, orderData, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => {

        }).catch((error) => {
            throw new Error(error)
        })
    } catch (error){
        throw new Error(error)
    }
}

async function getOrder(orderID) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    try {
        const response = await fetch(`${url}orders/${orderID}`, requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
async function getOrderArticles(orderID) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    try {
        const response = await fetch(`${url}orders/${orderID}/articles`, requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function getOrderArticlePhotos(orderID) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };

    try {
        const articleResponse = await fetch(`${url}orders/${orderID}/articles`, requestOptions);
        console.log(articleResponse);

        if (!articleResponse.ok) {

            throw new Error(`Failed to fetch article. Status: ${articleResponse.status}`);
        }
        const articleData = await articleResponse.json();


        const articleID = articleData.articles[0].articleID;

        const photoResponse = await fetch(`${url}articles/${articleID}/photos`);
        if (!photoResponse.ok) {
            throw new Error(`Failed to fetch photos. Status: ${photoResponse.status}`);
        }

        const clonedResponse = photoResponse.clone();
        return await clonedResponse.json();

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function changeOrderStatus(orderID, newStatus){
    const orderData = new FormData();
    orderData.append("orderID",orderID);
    orderData.append("orderStatus",newStatus)
    try {
        Axios.patch(`${url}orders/${orderID}`, orderData, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => {

        }).catch((error) => {
            throw new Error(error)
        })
    } catch (error){
        throw new Error(error)
    }
}
export {createOrder, getOrder, getOrderArticles, changeOrderStatus}
