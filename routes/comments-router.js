const {
  deleteComment,
  patchComment,
} = require("../controllers/comments-controllers");

const commentRouter = require("express").Router();

commentRouter.delete("/:comment_id", deleteComment);

commentRouter.patch("/:comment_id", patchComment);

module.exports = commentRouter;
