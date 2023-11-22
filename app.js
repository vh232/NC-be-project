const express = require('express');

const { handleServErr, handleCustomErr, handlePsqlErr } = require('./errorhandling');
const { getAllTopics } = require('./controllers/topics-controllers');
const { getEndpoints } = require('./controllers/endpoints-controllers');
const { getArticleById, getAllArticles, patchArticle } = require('./controllers/articles-controllers');
const { getArticleComments, postComment, deleteComment } = require('./controllers/comments-controllers');
const { getUsers } = require('./controllers/users-controllers');
const app = express();

app.use(express.json());

app.get('/api/topics', getAllTopics);

app.get('/api', getEndpoints);

app.get('/api/articles/:article_id', getAllArticles);

app.get('/api/articles/:article_id/comments', getArticleComments);

app.get('/api/articles', getAllArticles);

app.patch('/api/articles/:article_id', patchArticle);;

app.post('/api/articles/:article_id/comments', postComment);

app.get('/api/users', getUsers);

app.delete('/api/comments/:comment_id', deleteComment)

app.use(handlePsqlErr);
app.use(handleCustomErr);
app.use(handleServErr);

app.all("*", (req, res) => {
    res.status(404).send({ msg: 'path not found'})
})

module.exports = app