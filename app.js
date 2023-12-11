const express = require('express');
const { handleServErr, handleCustomErr, handlePsqlErr } = require('./errorhandling');
const app = express();
const apiRouter = require('./routes/api-router')
const userRouter = require('./routes/users-router');
const commentRouter = require('./routes/comments-router');
const articleRouter = require('./routes/articles-router');
const topicsRouter = require('./routes/topics-router');
const cors = require('cors')

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);
app.use('/api/users', userRouter);
app.use('/api/comments', commentRouter);
app.use('/api/articles', articleRouter);
app.use('/api/topics', topicsRouter);

app.use(handlePsqlErr);
app.use(handleCustomErr);
app.use(handleServErr);

app.all("*", (req, res) => {
    res.status(404).send({ msg: 'path not found'})
})

module.exports = app