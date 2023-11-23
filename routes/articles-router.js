const { getArticleById, getAllArticles, patchArticle, postArticle } = require('../controllers/articles-controllers');
const { getArticleComments, postComment } = require('../controllers/comments-controllers');

const articleRouter = require('express').Router();

articleRouter.get('/:article_id', getArticleById);
articleRouter.get('/:article_id/comments', getArticleComments);
articleRouter.get('/', getAllArticles);
articleRouter.patch('/:article_id', patchArticle);
articleRouter.post('/:article_id/comments', postComment);
articleRouter.post('/', postArticle);





module.exports = articleRouter;