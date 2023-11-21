const express = require('express');
const { getAllTopics, getArticleById, getEndpoints, getArticleComments, getAllArticles, patchArticle, postComment, getUsers, deleteComment } = require('./controllers/controllers');
const { handleServErr, handleCustomErr, handlePsqlErr } = require('./errorhandling');
const app = express();

app.use(express.json());

app.get('/api/topics', getAllTopics);

app.get('/api', getEndpoints);

app.get('/api/articles/:article_id', getArticleById);

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