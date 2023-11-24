const { checkArticleExists } = require("../models/articles-models");
const {
  postNewComment,
  deleteCommentById,
  getSingleArticlesComments,
  checkCommentExists,
  patchSingleComment,
  getPaginatedArticlesComments,
} = require("../models/comments-models");

exports.postComment = (req, res, next) => {
  const id = req.params.article_id;
  const newComment = req.body;
  const postPromises = [checkArticleExists(id), postNewComment(id, newComment)];
  Promise.all(postPromises)
    .then((resolvedPromises) => {
      const postedComment = resolvedPromises[1];
      res.status(201).send({ postedComment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const id = req.params.comment_id;
  deleteCommentById(id)
    .then(() => {
      res.status(204).send({});
    })
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  const id = req.params.article_id;
  const { limit, p } = req.query
  const commentPromises = [
    getSingleArticlesComments(id),
    checkArticleExists(id),
  ];
  if (limit || p) {
    commentPromises.push(getPaginatedArticlesComments(id, limit, p))
  } 
  
  Promise.all(commentPromises)
    .then((resolvedPromises) => {
      if (commentPromises.length === 2) {
      const comments = resolvedPromises[0];
      res.status(200).send({ comments: comments });
      }
      else {
        const comments = resolvedPromises[2];
      res.status(200).send({ comments: comments });
      }
    })
    .catch(next);
};

exports.patchComment = (req, res, next) => {
  const id = req.params.comment_id;
  const voteUpdate = req.body.inc_votes;
  const patchPromises = [
    checkCommentExists(id),
    patchSingleComment(id, voteUpdate),
  ];
  Promise.all(patchPromises)
    .then((resolvedPromises) => {
      const updatedComment = resolvedPromises[1];
      res.status(200).send({ updatedComment });
    })
    .catch(next);
};
