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
