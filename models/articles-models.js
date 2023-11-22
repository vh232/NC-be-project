const db = require("../db/connection");

  exports.patchSingleArticle = (inputId, voteUpdate) => {
    const queryVals = [inputId, voteUpdate]
    let queryStr = `UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;`
    return db.query(queryStr, queryVals)
    .then(({ rows }) => {
        return rows[0]
    })
}

exports.checkArticleExists = (inputId) => {
    const id = [inputId];
    return db
      .query(`SELECT * FROM articles WHERE article_id = $1;`, id)
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "not found" });
        }
      });
  };
  
  exports.getEachArticle = (topic, id) => {
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

    if (validTopics.includes(topic) && id) {
      queryVals.push(id)
      queryStr += `AND articles.article_id = $2 `
    }

    if (!topic && id) {
      queryVals.push(id)
      queryStr += `WHERE articles.article_id = $1 `
    }
    
    queryStr += `GROUP BY articles.article_id `
    
    queryStr += `ORDER BY created_at ASC;`
    return db.query(queryStr, queryVals)
    .then(({rows}) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else if (!topic && id) {
        return rows[0]
      } else {
        const rowsCopy = JSON.parse(JSON.stringify(rows))
        const noBodyRows = rowsCopy.map((row) => {
            delete row.body
            return row
        })
        return noBodyRows
      }
    })
}