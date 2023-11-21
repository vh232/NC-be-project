const db = require('../db/connection')
const jsonFile = require("../endpoints.json")


exports.getEachTopic = () => {
    return db.query(`SELECT * FROM topics;`)
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

exports.printEndpoints = () => {
    return jsonFile
}

exports.getSingleArticlesComments = (inputId) => {
    const id = [ inputId ]
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, id)
    
    .then(({ rows })  => {
        return rows
    })
}

exports.checkArticleExists = (inputId) => {
    const id = [ inputId ]
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, id)
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'not found'})
        }
    })
}
exports.getEachArticle = (topic) => {
    const queryVals = []
    const validTopics = [`cats`, `mitch`, `paper`]
    if (topic && !validTopics.includes(topic)) {
        return Promise.reject({ status: 404, msg: 'not found'})
    }

    let queryStr = `SELECT articles.*, COUNT(articles.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id ` 

    if (validTopics.includes(topic)) {
        queryVals.push(topic)
        queryStr += `WHERE topic = $1 `
    }
    
    queryStr += `GROUP BY articles.article_id `
    
    queryStr += `ORDER BY created_at ASC;`
    return db.query(queryStr, queryVals)
    .then(({rows}) => {
        const rowsCopy = JSON.parse(JSON.stringify(rows))
        const noBodyRows = rowsCopy.map((row) => {
            delete row.body
            return row
        })
        return noBodyRows
    })
}







exports.patchSingleArticle = (inputId, voteUpdate) => {
    const queryVals = [inputId, voteUpdate]
    let queryStr = `UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;`
    return db.query(queryStr, queryVals)
    .then(({ rows }) => {
        return rows[0]
    })
}

exports.postNewComment = (inputId, comment) => {
    const queryVals = [inputId, comment.username, comment.body]
    if (typeof comment !== 'object' || !comment.username || !comment.body) {
        return Promise.reject({ status: 400, msg: 'incorrect format'})
    }
    
    let queryStr = "INSERT INTO comments (body, author, article_id) VALUES ($3, $2, $1) RETURNING *;"
    return db.query(queryStr, queryVals)
    .then(({ rows }) => {
        return rows[0]
    })
}