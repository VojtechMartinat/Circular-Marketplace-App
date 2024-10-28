const asyncErrorWrapper = require('../middleware/asyncErrorWrapper')
const APIError = require('../errors/ErrorAPI')
const Article = require('../models/Article')


/**
 * * Get all articles from the database
 * @param req Request from the client
 * @param res Response sent to the client containing data about all articles
 * */
const getAllArticles = asyncErrorWrapper(async (req,res) =>{
    const article = Article.findAll()
    res.status(200).json({article})
})


/**
 * * Create a new Article and save it in the database
 * @param req Request from the client (req.body should contain article data)
 * @param res Response sent to the client containing new article data
 * */
const createArticle= asyncErrorWrapper(async (req,res) =>{
    const article = Article.create(req.body)
    res.status(201).json({article: article})
})


/**
 * * Get a single article from the database
 * @param req Request from the client (req.body should contain a valid articleID)
 * @param res Response sent to the client containing article data
 * */
const getArticle = asyncErrorWrapper(async (req,res,next) =>{
    const {id:articleID} = req.params
    const article = Article.findOne({
        where:{
            articleID: articleID
        }
    })
    if (!article){
        next(new APIError(`No article with id : ${articleID}`),404)
    }
    res.status(200).json({article})
})


/**
 * * Update article in a database
 * @param req Request from the client (req.body should contain a valid articleID and new article data)
 * @param res Response sent to the client containing article data
 * */
const updateArticle = asyncErrorWrapper(async (req,res,next) =>{
    const {id:articleID} = req.params
    const article = Article.update(req.body,{
        where: {
            articleID: articleID
        }
    })
    if (!article){
        next(new APIError(`No article with id : ${articleID}`),404)
    }
    res.status(200).json({article})
})


/**
 * * Delete a article from a database
 * ! Warning! This will actually delete a article from a database
 * @param req Request from the client (req.body should contain a valid articleID)
 * @param res Response sent to the client containing article data
 * */
const deleteArticle = asyncErrorWrapper(async (req,res,next) =>{
    const {id:articleID} = req.params
    const article = Article.delete({
        where:{
            articleID:articleID
        }
    });
    if (!article){
        next(new APIError(`No article with id : ${articleID}`),404)
    }
    res.status(200).json({article})
})

module.exports = {
    getAllArticles,createArticle,getArticle,updateArticle,deleteArticle
}