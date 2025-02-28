const express = require('express');
const router = express.Router();

const {getAllArticles, createArticle, getArticle, updateArticle,deleteArticle,articlePhotos, getUnsoldArticles, articlePhoto} = require('../controllers/articles');
router.route('/').get(getAllArticles).post(createArticle);
router.route('/unsold').get(getUnsoldArticles);
router.route('/:id').get(getArticle).patch(updateArticle).delete(deleteArticle);
router.route('/:id/photos').get(articlePhotos)
router.route('/:id/photo').get(articlePhoto)
module.exports = router;