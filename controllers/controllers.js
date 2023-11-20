const { getEachTopic } = require("../models/models")

exports.getAllTopics = (req, res, next) => {
    getEachTopic()
    .then((topics)=>{
        res.status(400).send({ topics })
    })
    .catch(next);
}

exports.getEndpoints = (req, res, next) => {
    
}