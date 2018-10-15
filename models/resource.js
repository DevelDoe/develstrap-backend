var mongoose = require('mongoose')

var resourceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    fields: { type: Array }
})

module.exports = mongoose.model('Resource', resourceSchema)
