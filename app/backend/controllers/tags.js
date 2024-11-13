const asyncErrorWrapper = require('../middleware/asyncErrorWrapper')
const APIError = require('../errors/ErrorAPI')
const {Tag} = require('../models/initialise')



/**
 * * Get all tags from the database
 * @param req Request from the client
 * @param res Response sent to the client containing data about all tags
 * */
const getAllTags = asyncErrorWrapper(async (req,res) =>{
    const tag = await Tag.findAll()
    res.status(200).json({tag})
})


/**
 * * Create a new Tag and save it in the database
 * @param req Request from the client (req.body should contain tag data)
 * @param res Response sent to the client containing new tag data
 * */
const createTag= asyncErrorWrapper(async (req,res) =>{
    const tag = await Tag.create(req.body)
    res.status(201).json({tag: tag})
})


/**
 * * Get a single tag from the database
 * @param req Request from the client (req.params should contain a valid tagID)
 * @param res Response sent to the client containing tag data
 * */
const getTag = asyncErrorWrapper(async (req,res,next) =>{
    const {id:tagID} = req.params
    const tag = await Tag.findOne({
        where:{
            tagID: tagID
        }
    })
    if (!tag){
        next(new APIError(`No tag with id : ${tagID}`),404)
    }
    res.status(200).json({tag})
})


/**
 * * Update tag in a database
 * @param req Request from the client (req.params should contain a valid tagID and req.body should contain new tag data)
 * @param res Response sent to the client containing tag data
 * */
const updateTag = asyncErrorWrapper(async (req,res,next) =>{
    const {id:tagID} = req.params
    const tag = await Tag.update(req.body,{
        where: {
            tagID: tagID
        }
    })
    if (!tag){
        next(new APIError(`No tag with id : ${tagID}`),404)
    }
    res.status(200).json({tag})
})


/**
 * * Delete a tag from a database
 * ! Warning! This will actually delete a tag from a database
 * @param req Request from the client (req.params should contain a valid tagID)
 * @param res Response sent to the client containing tag data
 * */
const deleteTag = asyncErrorWrapper(async (req,res,next) =>{
    const {id:tagID} = req.params
    const tag = await Tag.destroy({
        where:{
            tagID:tagID
        }
    });
    if (!tag){
        next(new APIError(`No tag with id : ${tagID}`),404)
    }
    res.status(200).json({tag})
})

module.exports = {
    getAllTags,createTag,getTag,updateTag,deleteTag
}