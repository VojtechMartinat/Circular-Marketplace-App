const asyncErrorWrapper = require('../middleware/asyncErrorWrapper')
const APIError = require('../errors/ErrorAPI')
const {Photo, Tag} = require('../models/initialise')


/**
 * * Get all photos from the database
 * @param req Request from the client
 * @param res Response sent to the client containing data about all photos
 * */
const getAllPhotos = asyncErrorWrapper(async (req,res) =>{
    const photo = Photo.findAll()
    res.status(200).json({photo})
})


/**
 * * Create a new Photo and save it in the database
 * @param req Request from the client (req.body should contain photo data)
 * @param res Response sent to the client containing new photo data
 * */
const createPhoto = asyncErrorWrapper(async (req, res) => {
    // Ensure file exists
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const { articleID } = req.body; // Assuming articleID is part of req.body
    const image = req.file.path; // `multer` stores the file in `req.file.path`

    const photo = await Photo.create({
        image: image,
        articleID: articleID
    });

    // Send response with created photo object
    res.status(201).json({ photo: photo });
});


/**
 * * Get a single photo from the database
 * @param req Request from the client (req.params should contain a valid photoID)
 * @param res Response sent to the client containing photo data
 * */
const getPhoto = asyncErrorWrapper(async (req,res,next) =>{
    const {id:photoID} = req.params
    const photo = Photo.findOne({
        where:{
            photoID: photoID
        }
    })
    if (!photo){
        next(new APIError(`No photo with id : ${photoID}`),404)
    }
    res.status(200).json({photo})
})


/**
 * * Update photo in a database
 * @param req Request from the client
 * (req.params should contain a valid photoID and req.body should contain new photo data)
 * @param res Response sent to the client containing photo data
 * */
const updatePhoto = asyncErrorWrapper(async (req,res,next) =>{
    const {id:photoID} = req.params
    const photo = await Photo.update(req.body,{
        where: {
            photoID: photoID
        }
    })
    if (!photo){
        next(new APIError(`No photo with id : ${photoID}`),404)
    }
    res.status(200).json({photo})
})


/**
 * * Delete a photo from a database
 * ! Warning! This will actually delete a photo from a database
 * @param req Request from the client (req.params should contain a valid photoID)
 * @param res Response sent to the client containing photo data
 * */
const deletePhoto = asyncErrorWrapper(async (req,res,next) =>{
    const {id:photoID} = req.params
    const photo = await Photo.destroy({
        where:{
            photoID:photoID
        }
    })
    if (!photo){
        next(new APIError(`No photo with id : ${photoID}`),404)
    }
    res.status(200).json({photo})
})


/**
 * * Get all photo tags from a database
 * @param req Request from the client (req.params should contain a valid photoID)
 * @param res Response sent to the client containing photo tags
 * */
const photosTags =  asyncErrorWrapper(async (req,res,next) =>{
    const {id:photoID} = req.params
    const tags = await Tag.findAll({
        where:{
            photoID: photoID
        }
    })
    if (!tags){
        next(new APIError(`No tags with photo id : ${photoID}`,404))
    }
})
module.exports = {
    getAllPhotos,createPhoto,getPhoto,updatePhoto,deletePhoto, photosTags
}