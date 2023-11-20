const db = require('../db/connection')

exports.getEachTopic = () => {
    return db.query(`SELECT * FROM topics`)
    .then(({ rows }) => {
        return rows
    })
}

exports.getSingleArticle = (inputId) => {
    const id = [ inputId ]
    return db.query(`SELECT * FROM articles WHERE id = `)
}