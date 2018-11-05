const User = require('../../models/user')

module.exports = ( api ) => {
    api.get('/public/autors', (req, res) => {
        User.find((err, authors) => {
            if (err) {
                error(res, err)
                return
            }
            authors.forEeach(author => {
                delete author.password
            })
            res.json(authors)
        })
    })
    api.get('/public/author', (req, res) => {
        User.findById(req.param('id'), (err, user) => {
            if (err) {
                error(res, err)
                return
            }
            if (!user) {
                res.end('No user')
            } else {
                delete user.password
                res.json(user)
            }
        })
    })
    function error(res, err) {
        res.status(500)
        res.json({
            err: 'Server ' + err
        })
    }
}