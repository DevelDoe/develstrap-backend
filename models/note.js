var mongoose = require('mongoose')

var noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    overview: { type: Boolean, required: true },
    user_id: { type: String, required: true },
    createdAt: { type: Number },
    updatedAt: { type: Number }
})

module.exports = mongoose.model('Note', noteSchema)
