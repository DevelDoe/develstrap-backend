const User = require('../../models/user')
const { error } = require('../../hlps')
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
                delete author.applications
                delete author.administrations
                delete author.sec_lv
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
                const author = JSON.parse(JSON.stringify(user))
                delete author.password
                delete author.applications
                delete author.administrations
                delete author.sec_lv
                res.json(author)
            }
        })
    })
}