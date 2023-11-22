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

  exports.getSingleArticle = (inputId) => {
    const id = [inputId];
    return db
      .query(`SELECT articles.*, COUNT(articles.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`, id)
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "not found" });
        }
        return rows[0];
      });
  };
  
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