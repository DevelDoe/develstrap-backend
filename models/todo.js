var mongoose = require('mongoose')

var todoSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    completed: { type: Boolean, required: true }
})

module.exports = mongoose.model('Todo', todoSchema)
