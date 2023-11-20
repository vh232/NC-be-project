exports.handlePsqlErr = (err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: 'bad request'})
    } else {
        next(err);
    }
}

exports.handleCustomErr = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg})
    } else {
        next(err);
    }
}

exports.handleServErr = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'internal server error'});
}