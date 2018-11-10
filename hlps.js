export const error = (res, err) => {
    res.status(500)
    res.json({
        err: 'Server ' + err
    })
}