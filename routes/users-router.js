const { getUsers, getIndividualUser } = require('../controllers/users-controllers');

const userRouter = require('express').Router();

userRouter.get('/', getUsers);

userRouter.get('/:username', getIndividualUser)

module.exports = userRouter;