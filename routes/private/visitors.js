const Visitor = require('../../models/visitor')
import { error } from '../../hlps'

module.exports = (api) => {
    api.get('visitors', (req, res) => {
        Visitor.find( (err, visitors) => {
            if (err) {
                error(res, err)
                return
            }
            res.json(visitors)
        })
    })
}