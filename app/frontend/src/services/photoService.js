import {url} from "../Config/config"


async function uploadPhoto(photoData) {
    try {
        await fetch(`${url}photos`, {
            method: 'POST',
            body: photoData,
        }).then((res) => res.json())
            .then((data) => {
                    return data
                }
            );
    } catch (error) {
        console.error('Error uploading photo:', error);
        throw error;
    }
}

async function getPhotos() {
    try {
        const response = await fetch(`${url}photos`);
        const data = await response.json();

        if (!data) {
            throw new Error("No photos found or data missing!");
        }

        return data;
    } catch (error) {
        console.error('Error fetching photos:', error);
        throw error;
    }
}

export { getPhotos, uploadPhoto };