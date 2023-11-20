const { getEachTopic, printEndpoints, getEachArticle } = require("../models/models")


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

exports.getAllArticles = (req, res, next) => {
    getEachArticle()
    .then((articles) => {
        res.status(200).send({ articles })
    })
    .catch(next);
}