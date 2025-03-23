const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer')
const {getAllPhotos, createPhoto, getPhoto, updatePhoto, deletePhoto,photosTags, getPhotosByArticleIds} = require('../controllers/photos');

router.route('/').get(getAllPhotos).post(upload.single('image'), createPhoto);
router.route('/articles').post(getPhotosByArticleIds)
router.route('/:id').get(getPhoto).patch(updatePhoto).delete(deletePhoto);
router.route('/:id/tags').get(photosTags)

module.exports = router;