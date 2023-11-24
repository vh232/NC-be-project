const { getAllTopics, postTopic } = require("../controllers/topics-controllers");

const topicsRouter = require("express").Router();

topicsRouter.get("/", getAllTopics);
topicsRouter.post("/", postTopic);

module.exports = topicsRouter;
