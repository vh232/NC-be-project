const db = require("../db/connection");

exports.getAllUsers = () => {
    let queryStr = `SELECT * FROM users;`;
    return db.query(queryStr).then(({ rows }) => {
      return rows;
    });
  };