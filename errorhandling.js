exports.handlePsqlErr = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502" || err.code === "23505") {
    res.status(400).send({ msg: "bad request" });
      } else if (err.code === "23503") {
        res.status(404).send({ msg: "not found" });
  } else {
    next(err);
  }
};

exports.handleCustomErr = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleServErr = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
};
