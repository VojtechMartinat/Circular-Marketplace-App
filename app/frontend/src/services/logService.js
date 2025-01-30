import {url} from "../Config/config";
import axios from "axios";

async function createTaskLog(taskLogData) {
    if (taskLogData == null) {
        throw new Error("TaskLog data missing!");
    }

    try {
        return await axios.post(`${url}tasklog`, taskLogData, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export {createTaskLog}