const db = require('../db/connection')
const jsonFile = require("../endpoints.json")


exports.getEachTopic = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({ rows }) => {
        return rows
    })
}

exports.printEndpoints = () => {
    return jsonFile
}

exports.getEachArticle = () => {
    return db.query(`SELECT articles.*, COUNT(articles.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id;`)
    .then(({rows}) => {
        console.log(rows)
        return rows
    })
}