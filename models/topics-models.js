const db = require("../db/connection");

exports.getEachTopic = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.postNewTopic = (newTopic) => {
  const { slug, description } = newTopic;
  const queryVals = [slug, description];
  const queryStr = `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;`;
  return db.query(queryStr, queryVals).then(({ rows }) => {
    return rows[0];
  });
};
