var mongoose = require('mongoose')
module.exports = mongoose.model('Exercise', {
     group        : { type: String, required: true },
     name         : { type: String, required: true, unique: true },
     equipment    : { type: String, required: true },
     rated        : { type: Number },
     type         : { type: String, required: true },
     mechanic     : { type: String, required: true },
     video        : { type: String },
     images       : { type: String },
     instructions : { type: Array },
     created_at   : { type: String },
     updated_at   : { type: String },
})