const express = require('express');
const router = express.Router();

const {getAllTaskLogs, createTaskLog, getTaskLog, updateTaskLog, deleteTaskLog} = require('../controllers/taskLogs');

router.route('/').get(getAllTaskLogs).post(createTaskLog);
router.route('/:id').get(getTaskLog).patch(updateTaskLog).delete(deleteTaskLog);

module.exports = router;
