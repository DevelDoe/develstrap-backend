module.exports = function error(res, err) {
    res.status(500)
    res.json({
        err: 'Server ' + err
    })
}