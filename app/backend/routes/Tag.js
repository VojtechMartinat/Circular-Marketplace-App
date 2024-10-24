const express = require('express');
const router = express.Router();

const {getAllTags, createTags, getTag, updateTag, deleteTag} = require('./controllers/Tag');

router.route('/').get(getAllTags).post(createTags);
router.route('/:id').get(getTag).patch(updateTag).deleteTag(deleteTag);

module.exports = router;
