import { url } from "../Config/config";
import axios from "axios";

async function createMessage(messageData) {
    if (!messageData) {
        throw new Error("Message data is missing!");
    }

    try {
        return await axios.post(`${url}messages`, messageData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error creating message:', error);
        throw error;
    }
}

async function getAllMessages() {
    try {
        const response = await fetch(`${url}messages`);
        const data = await response.json();

        if (!data) {
            throw new Error("No messages found!");
        }

        return data;
    } catch (error) {
        console.error('Error fetching all messages:', error);
        throw error;
    }
}

async function getMessage(messageID) {
    if (!messageID) {
        throw new Error("Message ID is missing!");
    }

    try {
        const response = await fetch(`${url}messages/${messageID}`);
        const data = await response.json();

        if (!data) {
            throw new Error("Message not found!");
        }

        return data;
    } catch (error) {
        console.error('Error fetching message:', error);
        throw error;
    }
}

async function getMessages(senderID, receiverID) {
    if (!senderID || !receiverID) {
        throw new Error("Sender and Receiver IDs are required!");
    }

    try {
        const response = await fetch(`${url}messages/${senderID}/${receiverID}`);
        const data = await response.json();

        if (!data) {
            throw new Error("No messages found between these users!");
        }

        return data;
    } catch (error) {
        console.error('Error fetching messages between users:', error);
        throw error;
    }
}

async function updateMessage(messageID, updatedData) {
    if (!messageID || !updatedData) {
        throw new Error("Message ID and updated data are required!");
    }

    try {
        return await axios.patch(`${url}messages/${messageID}`, updatedData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error updating message:', error);
        throw error;
    }
}

async function deleteMessage(messageID) {
    if (!messageID) {
        throw new Error("Message ID is missing!");
    }

    const requestOptions = {
        method: 'DELETE',
    };

    try {
        const response = await fetch(`${url}messages/${messageID}`, requestOptions);

        if (!response.ok) {
            throw new Error(`Failed to delete message with status: ${response.status}`);
        }

        return { message: 'Message deleted successfully' };
    } catch (error) {
        console.error('Error deleting message:', error);
        throw error;
    }
}

export { createMessage, getAllMessages, getMessage, getMessages, updateMessage, deleteMessage };
