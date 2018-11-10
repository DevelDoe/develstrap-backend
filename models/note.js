var mongoose = require('mongoose')

module.exports = mongoose.model('Note', {
    title: { type: String, required: true },
    overview: { type: Boolean, required: true },
    user_id: { type: String, required: true },
    createdAt: { type: Number },
    updatedAt: { type: Number }
})
