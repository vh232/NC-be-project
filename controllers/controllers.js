const { getEachTopic, getSingleArticle, printEndpoints, getSingleArticlesComments, checkArticleExists, getEachArticle, patchSingleArticle, postNewComment } = require("../models/models")



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

exports.getAllArticles = (req, res, next) => {
    const topic = req.query.topic
    getEachArticle(topic)
    .then((articles) => {
        res.status(200).send({ articles })
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

exports.patchArticle = (req, res, next) => {
    const id = req.params.article_id
    const voteUpdate = req.body.inc_votes
    const patchPromises = [checkArticleExists(id), patchSingleArticle(id, voteUpdate)]
    Promise.all(patchPromises)
    .then((resolvedPromises) => {
        const updatedArticle = resolvedPromises[1]
        res.status(200).send({ updatedArticle })
    })
    .catch(next);
}

exports.postComment = (req, res, next) => {
    const id = req.params.article_id
    const newComment = req.body
    const postPromises = [checkArticleExists(id), postNewComment(id, newComment)]
    Promise.all(postPromises)
    .then((resolvedPromises) => {
        const postedComment = resolvedPromises[1]
        res.status(201).send({ postedComment })
    })
    .catch(next);
};