const { getEachTopic, postNewTopic } = require("../models/topics-models");

exports.getAllTopics = (req, res, next) => {
  getEachTopic()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const newTopic = req.body;
  postNewTopic(newTopic)
    .then((newTopic) => {
      res.status(201).send({ newTopic });
    })
    .catch(next);
};
