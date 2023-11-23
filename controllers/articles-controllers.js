const {
  getSingleArticle,
  getEachArticle,
  checkArticleExists,
  patchSingleArticle,
} = require("../models/articles-models");

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;
  getSingleArticle(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { query } = req;
  const { topic, sort_by, order } = query;
  getEachArticle(topic, sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const id = req.params.article_id;
  const voteUpdate = req.body.inc_votes;
  const patchPromises = [
    checkArticleExists(id),
    patchSingleArticle(id, voteUpdate),
  ];
  Promise.all(patchPromises)
    .then((resolvedPromises) => {
      const updatedArticle = resolvedPromises[1];
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};
