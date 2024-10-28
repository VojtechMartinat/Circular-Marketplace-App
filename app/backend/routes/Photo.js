const express = require('express');
const router = express.Router();

const {getAllPhotos, createPhotos, getPhoto, updatePhoto, deletePhoto} = require('../controllers/Photo');

router.route('/').get(getAllPhotos).post(createPhotos);
router.route('/:id').get(getPhoto).patch(updatePhoto).delete(deletePhoto);

module.exports = router;
