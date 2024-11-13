
const userAPI = 'http://34.251.202.114:8080/api/v1/';

async function uploadPhoto(photoData) {
    try {
        await fetch(`${userAPI}photos`, {
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
        const response = await fetch(`${userAPI}photos`);
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