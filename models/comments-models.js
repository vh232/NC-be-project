const db = require("../db/connection");

exports.deleteCommentById = (inputId) => {
  const id = [inputId];
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, id)
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
    });
};

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

exports.checkCommentExists = (id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
    });
};

exports.patchSingleComment = (id, voteUpdate) => {
  const queryVals = [id, voteUpdate];
  const queryStr = `UPDATE comments SET votes = votes + $2 WHERE comment_id = $1 RETURNING *`;
  return db.query(queryStr, queryVals).then(({ rows }) => {
    return rows[0];
  });
};

exports.deleteArticlesComments = (inputId) => {
  const id = [inputId];
  const queryStr = `DELETE FROM comments WHERE article_id = $1 RETURNING *;`;
  return db.query(queryStr, id).then(({ rows }) => {
    return rows;
  });
};

exports.getPaginatedArticlesComments = (inputId, limit = 10, page = "1") => {
  let offset = 0;
  const queryVals = [inputId, limit];
  const regexNotDigit = /[\D]/g;
  const splitPage = page.split("");
  if (splitPage.some((character) => regexNotDigit.test(character))) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  if (page > 1) {
    offset = page * limit - limit;
    queryVals.push(offset);
  } else {
    queryVals.push(offset);
  }
  console.log(queryVals, "inputid, limit, offset")
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC OFFSET $3 ROWS FETCH NEXT $2 ROWS ONLY;`,
      queryVals
    )
    .then(({ rows }) => {
      console.log('returning these rows')
      return rows;
    });
};
