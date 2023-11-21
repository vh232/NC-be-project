exports.handlePsqlErr = (err, req, res, next) => {
    if (err.code === "22P02" || err.code === "23502") {
        res.status(400).send({ msg: 'bad request'})
    } else if (err.detail === `Key (author)=(${req.body.username}) is not present in table "users".`){
        res.status(404).send({ msg: 'user does not exist'})
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