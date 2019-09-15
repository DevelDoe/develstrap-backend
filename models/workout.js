var mongoose = require('mongoose')
module.exports = mongoose.model('Workout', {
     group       : { type: String, required: true },
     name        : { type: String, required: true },
     exercise_id : { type: String, required: true },
     level       : { type: Number, required: true },
     weight      : { type: Number, required: true },
     repetitions : { type: Number },
     target      : { type: Number, required: true },
     created_at: { type: String },
     updated_at: { type: String },
     user_id: { type: String, required: true }
})