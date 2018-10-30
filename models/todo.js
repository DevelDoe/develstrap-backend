var mongoose = require('mongoose')

var todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, required: true },
    user_id: { type: String, required: true },
    createdAt: { type: Number },
    updatedAt: { type: Number }
})

module.exports = mongoose.model('Todo', todoSchema)
