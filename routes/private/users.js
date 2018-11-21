const User = require('../../models/user')

module.exports = function (api) {
    api.get('/users', (req, res) => {
        User.find((err, user) => {
            if (err) {
                error(res, err)
                return
            }
            res.json(user)
        })
    })
    api.post('/users', (req, res) => {
        var user = new User()
        console.log(req.body)
        user.fname = req.body.fname
        user.lname = req.body.lname
        if (req.body.username !== '') user.username = req.body.username
        user.email = req.body.email
        user.password = req.body.password
        if (!req.body.img_src || req.body.img_src === '') user.img_src = '/uploads/images/processed/default.jpg'
        else user.img_src = req.body.img_src
        user.sec_lv = req.body.sec_lv
        user.applications = req.body.applications
        user.administrations = req.body.administrations
        user.save(err => {
            if (err) {
                error(res, err)
                return
            }
            res.json(user)
        })
    })
    api.delete('/users/:_id', (req, res) => {
        User.remove({
            _id: req.params._id
        }, (err, user) => {
            if (err) {
                error(res, err)
                return
            }
            res.sendStatus(200)
        })
    })
    api.put('/users/:_id', (req, res) => {
        User.findById(req.params._id, (err, user) => {
            if (err) {
                error(res, err)
                return
            }
            user.fname = req.body.fname
            user.lname = req.body.lname
            if (req.body.username !== '') user.username = req.body.username
            user.email = req.body.email
            user.password = req.body.password
            if (!req.body.img_src || req.body.img_src === '') user.img_src = '/uploads/images/processed/default.jpg'
            else user.img_src = req.body.img_src
            user.sec_lv = req.body.sec_lv
            user.applications = req.body.applications
            user.administrations = req.body.administrations
            user.save(err => {
                if (err) {
                    error(res, err)
                    return
                }
                res.json(user)
            })
        })
    })

    function error(res, err) {
        res.status(500)
        res.json({
            err: 'Server ' + err
        })
    }
}