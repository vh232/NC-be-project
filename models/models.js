const db = require('../db/connection')
const jsonFile = require("../endpoints.json")


exports.getEachTopic = () => {
    return db.query(`SELECT * FROM topics`)
    .then(({ rows }) => {
        return rows
    })
}

exports.printEndpoints = () => {
    return jsonFile
}
