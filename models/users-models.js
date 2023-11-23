const db = require("../db/connection");

exports.getAllUsers = () => {
    let queryStr = `SELECT * FROM users;`;
    return db.query(queryStr).then(({ rows }) => {
      return rows;
    });
  };

  exports.getUserByUsername = (username) => {
    const user = [username]
    return db.query(`SELECT * FROM users WHERE username = $1`, user)
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: 'user does not exist'})
      }
      return rows[0]
    })
  }