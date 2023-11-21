const { getEachTopic, getSingleArticle, printEndpoints, getSingleArticlesComments, checkArticleExists } = require("../models/models")

exports.getAllTopics = (req, res, next) => {
    getEachTopic()
    .then((topics)=>{
        res.status(200).send({ topics })
    })
    .catch(next);
}

exports.getEndpoints = (req, res, next) => {
    const endpoints = printEndpoints()
    return res.status(200).send({ endpoints }
    )}

exports.getArticleById = (req, res, next) => {
    const id = req.params.article_id
    getSingleArticle(id)
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch(next);
}

exports.getArticleComments = (req, res, next) => {
    const id = req.params.article_id
    const commentPromises = [getSingleArticlesComments(id), checkArticleExists(id)]
    Promise.all(commentPromises)
    .then((resolvedPromises) => {
        const comments = resolvedPromises[0]
        res.status(200).send({ comments: comments })
    })
    .catch(next);
}
    
