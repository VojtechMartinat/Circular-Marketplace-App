const express = require('express');
const router = express.Router();

const {getAllPhotos, createPhoto, getPhoto, updatePhoto, deletePhoto} = require('../controllers/photos');

router.route('/').get(getAllPhotos).post(createPhoto);
router.route('/:id').get(getPhoto).patch(updatePhoto).delete(deletePhoto);

module.exports = router;
