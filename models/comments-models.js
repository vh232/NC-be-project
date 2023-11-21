const db = require("../db/connection");

exports.deleteCommentById = (inputId) => {
    const id = [inputId]
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, id)
    .then(({rows}) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: 'not found'})
        }
        return db.query(`SELECT * FROM comments WHERE comment_id = $1;`, id)
    })
    .then(({ rows }) => {
        if (!rows.length) {
            return rows
        } else {
            return 'unable to delete comment'
        }
    })
}

exports.postNewComment = (inputId, comment) => {
    const queryVals = [inputId, comment.username, comment.body];
    if (typeof comment !== "object" || !comment.username || !comment.body) {
      return Promise.reject({ status: 400, msg: "incorrect format" });
    }
  
    let queryStr =
      "INSERT INTO comments (body, author, article_id) VALUES ($3, $2, $1) RETURNING *;";
    return db.query(queryStr, queryVals).then(({ rows }) => {
      return rows[0];
    });
  };

  exports.getSingleArticlesComments = (inputId) => {
    const id = [inputId];
    return db
      .query(
        `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
        id
      )
  
      .then(({ rows }) => {
        return rows;
      });
  };