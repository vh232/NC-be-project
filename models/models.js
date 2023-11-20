const db = require('../db/connection')

exports.getEachTopic = () => {
    return db.query(`SELECT * FROM topics`)
    .then(({ rows }) => {
        return rows
    })
}

exports.getSingleArticle = (inputId) => {
    const id = [ inputId ]
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, id)
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'not found'})
        }
        return rows[0]
    })
}