const express = require('express');
const router = express.Router();

const {getAllTags, createTags, getTag, updateTag, deleteTag} = require('../controllers/tags');

router.route('/').get(getAllTags).post(createTags);
router.route('/:id').get(getTag).patch(updateTag).delete(deleteTag);

module.exports = router;
