const { getEndpoints } = require('../controllers/endpoints-controllers');

const apiRouter = require('express').Router();

apiRouter.get('/', getEndpoints);

module.exports = apiRouter;