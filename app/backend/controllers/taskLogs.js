const asyncErrorWrapper = require('../middleware/asyncErrorWrapper')
const APIError = require('../errors/ErrorAPI')
const {TaskLog} = require('../models/initialise')



/**
 * * Get all tags from the database
 * @param req Request from the client
 * @param res Response sent to the client containing data about all tags
 * */
const getAllTaskLogs = asyncErrorWrapper(async (req,res) =>{
    const taskLogs = await TaskLog.findAll()
    res.status(200).json({taskLogs})
})


/**
 * * Create a new Tag and save it in the database
 * @param req Request from the client (req.body should contain tag data)
 * @param res Response sent to the client containing new tag data
 * */
const createTaskLog= asyncErrorWrapper(async (req,res) =>{
    try{
        const taskLog = await TaskLog.create(req.body)
        res.status(201).json({taskLog: taskLog})
    } catch (error){
        console.log(error)
    }

})


/**
 * * Get a single tag from the database
 * @param req Request from the client (req.params should contain a valid tagID)
 * @param res Response sent to the client containing tag data
 * */
const getTaskLog = asyncErrorWrapper(async (req,res,next) =>{
    const {id:taskID} = req.params
    const taskLog = await TaskLog.findOne({
        where:{
            taskID: taskID
        }
    })
    if (!taskLog){
        return next(new APIError(`No tag with id : ${taskID}`), 404);
    }
    res.status(200).json({taskLog})
})


/**
 * * Update tag in a database
 * @param req Request from the client (req.params should contain a valid tagID and req.body should contain new tag data)
 * @param res Response sent to the client containing tag data
 * */
const updateTaskLog = asyncErrorWrapper(async (req, res, next) => {
    const { id: taskID } = req.params;
    const [tasks] = await TaskLog.update(req.body, {
        where: {
            taskID: taskID,
        },
    });

    if (tasks === 0) {
        // If no rows were affected, the tag doesn't exist
        return next(new APIError(`No tag with id : ${taskID}`, 404));
    }

    // Retrieve the updated tag from the database
    const updatedTaskLog = await TaskLog.findOne({
        where: {
            taskID: taskID,
        },
    });

    res.status(200).json({ tag: updatedTaskLog });
});


/**
 * * Delete a tag from a database
 * ! Warning! This will actually delete a tag from a database
 * @param req Request from the client (req.params should contain a valid tagID)
 * @param res Response sent to the client containing tag data
 * */
const deleteTaskLog = asyncErrorWrapper(async (req,res,next) =>{
    const {id:taskID} = req.params
    const taskLog = await TaskLog.destroy({
        where:{
            taskID:taskID
        }
    });
    if (!taskLog){
        next(new APIError(`No tag with id : ${taskID}`),404)
    }
    res.status(200).json({taskLog})
})


module.exports = {
    getAllTaskLogs,createTaskLog,getTaskLog,updateTaskLog,deleteTaskLog,
}