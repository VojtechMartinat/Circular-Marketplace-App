import axios from "axios";
import {url} from "../Config/config";

async function createWishlist(wishlistData) {
    if (wishlistData == null) {
        throw new Error("Wihlist data missing!");
    }

    try {
        return await axios.post(`${url}wishlists`, wishlistData, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function getWishlist(wishlistID){
    const  requestOptions = {
        method: 'GET',
        headers : {
            'Content-Type': 'application/json',
        },
    }
    try{
        const response = await fetch(`${url}wishlists/${wishlistID}`,requestOptions)
        if (!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json()
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
async function getUserWishlists(userID){
    const  requestOptions = {
        method: 'GET',
        headers : {
            'Content-Type': 'application/json',
        },
    }
    try{
        const response = await fetch(`${url}users/${userID}/wishlists`,requestOptions)
        if (!response.ok){
            console.error('Error:', response);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json()
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function deleteWishlist(wishlistID){
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }
    try {
        const response = await axios.delete(`${url}wishlists/${wishlistID}`, requestOptions);
        if (!response.status === 204) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
export {createWishlist,getWishlist,getUserWishlists,deleteWishlist};