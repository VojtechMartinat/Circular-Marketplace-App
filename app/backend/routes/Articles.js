const express = require('express');
const router = express.Router();

const {getAllArticles, createArticle, getArticle, updateArticle,deleteArticle,articlePhotos} = require('../controllers/articles');
router.route('/').get(getAllArticles).post(createArticle);
router.route('/:id').get(getArticle).patch(updateArticle).delete(deleteArticle);
router.route('/id/photos').get(articlePhotos)

module.exports = router;