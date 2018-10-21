var mongoose = require('mongoose')

var noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    user_id: { type: String, required: true }
})

module.exports = mongoose.model('Note', noteSchema)
