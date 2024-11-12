const express = require('express');
const router = express.Router();

const {getAllPhotos, createPhoto, getPhoto, updatePhoto, deletePhoto,photosTags} = require('../controllers/photos');

router.route('/').get(getAllPhotos).post(createPhoto);
router.route('/:id').get(getPhoto).put(updatePhoto).patch(updatePhoto).delete(deletePhoto);
router.route('/:id/tags').get(photosTags)

module.exports = router;
