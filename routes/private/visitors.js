const Visitor = require('../../models/visitor')
const { error } = require( '../../hlps')

module.exports = (api) => {
    api.get('/visitors', (req, res) => {
        Visitor.find( (err, visitors) => {
            if (err) {
                error(res, err)
                return
            }
            res.json(visitors)
        })
    })
}