var mongoose = require('mongoose')
module.exports = mongoose.model('Exercise', {
     group      : { type: String },
     name       : { type: String },
     equipment  : { type: String },
     rated      : { type: Number },
     type       : { type: String },
     mechanics  : { type: String },
     created_at : { type: String },
     updated_at : { type: String },
})