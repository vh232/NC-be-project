const { getAllUsers, getUserByUsername } = require("../models/users-models");

exports.getUsers = (req, res, next) => {
    getAllUsers()
    .then((users) => {
        res.status(200).send({ users })
})
    .catch(next);
}

exports.getIndividualUser = (req, res, next) => {
    const username = req.params.username
    getUserByUsername(username)
    .then((users) => {
        res.status(200).send({ users })
    })
    .catch(next);
}

