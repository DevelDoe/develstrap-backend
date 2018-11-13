var mongoose = require('mongoose')

module.exports = mongoose.model('Todo', {
    title: { type: String, required: true },
    completed: { type: Boolean, required: true },
    user_id: { type: String, required: true },
    createdAt: { type: Number },
    updatedAt: { type: Number }
})
