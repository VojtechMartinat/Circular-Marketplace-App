const express = require('express');
const router = express.Router();

const {getAllArticles, createArticles, getArticle, updateArticle,deleteArticle} = require('./controllers/Article');

router.route('/').get(getAllArticles).post(createArticles);
router.route('/:id').get(getArticle).patch(updateArticle).delete(deleteArticle);

module.exports = router;