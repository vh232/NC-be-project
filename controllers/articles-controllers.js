const {
  getSingleArticle,
  getEachArticle,
  checkArticleExists,
  patchSingleArticle,
  postNewArticle,
  returnNewArticle,
  deleteSingleArticle,
} = require("../models/articles-models");
const { deleteArticlesComments } = require("../models/comments-models");

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

exports.postArticle = (req, res, next) => {
  const article = req.body;
  postNewArticle(article)
    .then(() => {
      return returnNewArticle(article);
    })
    .then(({ rows }) => {
      const postedArticle = rows[0];
      res.status(201).send({ postedArticle });
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const id = req.params.article_id;
  const deletePromises = [deleteArticlesComments(id), deleteSingleArticle(id)];
  Promise.all(deletePromises)
    .then(() => {
      res.status(204).send({});
    })
    .catch(next);
};
