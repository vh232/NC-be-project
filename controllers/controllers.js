const { getEachTopic, getSingleArticle, printEndpoints } = require("../models/models")

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
    
