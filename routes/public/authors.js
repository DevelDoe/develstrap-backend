const User = require('../../models/user')

module.exports = function ( api ) {
    api.get('/public/authors', (req, res) => {
        User.find((err, a) => {
            if (err) {
                error(res, err)
                return
            }
            const authors = JSON.parse(JSON.stringify(a))
            authors.forEach(author => {
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