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
    let queryStr = `SELECT articles.*, COUNT(articles.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id `
    
    queryStr += 'ORDER BY created_at ASC'
    return db.query(queryStr)
    .then(({rows}) => {
        const rowsCopy = JSON.parse(JSON.stringify(rows))
        const noBodyRows = rowsCopy.map((row) => {
            delete row.body
            return row
        })
        return noBodyRows
    })
}