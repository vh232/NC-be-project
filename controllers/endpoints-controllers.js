const {printEndpoints} = require("../models/endpoints-models")





exports.getEndpoints = (req, res, next) => {
    const endpoints = printEndpoints()
    return res.status(200).send({ endpoints }
    )}











