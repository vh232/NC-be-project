const express = require('express');
const { getAllTopics, getArticleById } = require('./controllers/controllers');
const { handleServErr, handleCustomErr, handlePsqlErr } = require('./errorhandling');
const app = express();

app.get('/api/topics', getAllTopics);

app.get('/api')

app.get('/api/articles/:article_id', getArticleById);

app.use(handlePsqlErr);

app.use(handleCustomErr);

app.use(handleServErr);

app.all("*", (req, res) => {
    res.status(404).send({ msg: 'path not found'})
})

module.exports = app