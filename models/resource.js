var mongoose = require('mongoose')

var resourceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    fields: { type: Array },
    read: { type: Number, required: true },
    write: { type: Number, required: true }
})

module.exports = mongoose.model('Resource', resourceSchema)
