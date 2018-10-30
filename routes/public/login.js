const config = require('../../config'),
      jwt = require('jwt-simple'),
      User = require('../../models/user')

module.exports = function (api) {

    api.post('/public/login', (req, res) => {
        // if req header is from certain site just hand over an token.
        User.findOne({
            'email': 'root@develdevils.se'
        }, function (err, result) {
            if (err) {
                error(res, err)
                return
            }
            if (!result) {
                var root = new User()
                root.username = 'root'
                root.email = 'root@develdevils.se'
                root.password = 'JI21ko87.'
                root.sec_lv = 0
                root.administrations = ['users', 'data']
                root.save(err => {
                    if (err) {
                        error(res, err)
                        return
                    }
                })
            }
            User.findOne({
                'email': req.body.email
            }, (err, user) => {
                if (err) {
                    error(res, err)
                    return
                }
                if (!user) {
                    res.json({
                        msg: 'User not found!'
                    })
                } else {
                    user.comparePassword(req.body.password, function (err, isMatched) {
                        console.log(isMatched)
                        if (isMatched && !err) {
                            var token = jwt.encode(user, config.secret)

                            res.json({
                                user: user,
                                token: 'JWT ' + token
                            })
                        } else {
                            res.json({
                                message: 'Invalid password'
                            })
                        }
                    })
                }
            })
        })

    })
    api.post('/public/logout', function (req, res) {
        req.logout()
        res.json({
            msg: 'Loged out'
        })
        res.end()
    })
    function error(res, err) {
        res.status(500)
        res.json({
            err: 'Server ' + err
        })
    }
}