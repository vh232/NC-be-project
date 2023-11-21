const { checkArticleExists } = require("../models/articles-models");
const { postNewComment, deleteCommentById, getSingleArticlesComments } = require("../models/comments-models");

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

exports.deleteComment = (req, res, next) => {
    const id = req.params.comment_id
    deleteCommentById(id)
    .then(() => {
        res.status(204).send({})
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