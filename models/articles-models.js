const db = require("../db/connection");

exports.patchSingleArticle = (inputId, voteUpdate) => {
  const queryVals = [inputId, voteUpdate];
  let queryStr = `UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;`;
  return db.query(queryStr, queryVals).then(({ rows }) => {
    return rows[0];
  });
};

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
    .query(
      `SELECT articles.*, COUNT(articles.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
      id
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows[0];
    });
};

exports.getEachArticle = (
  topic,
  sort_by = "created_at",
  inputOrder = "DESC"
) => {
  const order = inputOrder.toUpperCase();
  const queryVals = [];
  const validTopics = [`cats`, `mitch`, `paper`];
  const validSorts = ["author", "title", "topic", "created_at"];
  const validOrder = ["ASC", "DESC"];

  if (topic && !validTopics.includes(topic)) {
    return Promise.reject({ status: 404, msg: "not found" });
  }

  if (!validSorts.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  let queryStr = `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;

  if (validTopics.includes(topic)) {
    queryVals.push(topic);
    queryStr += `WHERE topic = $1 `;
  }

  queryStr += `GROUP BY articles.article_id `;
  queryStr += `ORDER BY ${sort_by} ${order}`;
  queryStr += `;`;
  return db.query(queryStr, queryVals).then(({ rows }) => {
    const rowsCopy = JSON.parse(JSON.stringify(rows));
    const noBodyRows = rowsCopy.map((row) => {
      delete row.body;
      return row;
    });
    return noBodyRows;
  });
};

exports.postNewArticle = (articleInput) => {
  const { author, title, body, topic } = articleInput;
  const queryVals = [author, title, body, topic];
  let queryStr = "";
  if (!articleInput.article_img_url) {
    queryStr = `INSERT INTO articles (author, title, body, topic) VALUES ($1, $2, $3, $4);`;
  } else {
    queryVals.push(articleInput.article_img_url);
    queryStr = `INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5);`;
  }

  return db.query(queryStr, queryVals).then(({ rows }) => {
    return rows[0];
  });
};

exports.returnNewArticle = (articleInput) => {
  const queryVals = [articleInput.author, articleInput.title];
  return db.query(
    `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.author = $1 AND articles.title = $2 GROUP BY articles.article_id;`,
    queryVals
  );
};

exports.deleteSingleArticle = (inputId) => {
  const id = [inputId];
  const queryStr = `DELETE FROM articles WHERE article_id = $1 RETURNING *;`;
  return db.query(queryStr, id).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "not found" });
    }
    return rows;
  });
};

exports.paginatedArticles = (
  topic,
  sort_by = "created_at",
  inputOrder = "DESC",
  limit = 10,
  page = "1"
) => {
  let offset = 0;
  const order = inputOrder.toUpperCase();
  const queryVals = [limit];
  const validTopics = [`cats`, `mitch`, `paper`];
  const validSorts = ["author", "title", "topic", "created_at"];
  const validOrder = ["ASC", "DESC"];
  const regexNotDigit = /[\D]/g;
  const splitPage = page.split("");
  if (splitPage.some((character) => regexNotDigit.test(character))) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  if (topic && !validTopics.includes(topic)) {
    return Promise.reject({ status: 404, msg: "not found" });
  }

  if (!validSorts.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  if (page > 1) {
    offset = page * limit - limit;
    queryVals.push(offset);
  } else {
    queryVals.push(offset);
  }

  let queryStr = `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;

  if (validTopics.includes(topic)) {
    queryVals.push(topic);
    queryStr += `WHERE topic = $3 `;
  }

  queryStr += `GROUP BY articles.article_id `;
  queryStr += `ORDER BY ${sort_by} ${order} LIMIT $1 OFFSET $2`;
  queryStr += `;`;
  return db.query(queryStr, queryVals).then(({ rows }) => {
    const rowsCopy = JSON.parse(JSON.stringify(rows));
    const noBodyRows = rowsCopy.map((row) => {
      delete row.body;
      return row;
    });
    return noBodyRows;
  });
};
