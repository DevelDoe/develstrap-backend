var mongoose = require('mongoose')
module.exports = mongoose.model('Exercise', {
     group      : { type: String, required: true },
     name       : { type: String, required: true, unique: true },
     equipment  : { type: String, required: true },
     rated      : { type: Number },
     type       : { type: String, required: true },
     mechanics  : { type: String, required: true },
     created_at : { type: String },
     updated_at : { type: String },
})