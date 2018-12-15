var mongoose = require('mongoose')

module.exports = mongoose.model('Message', {
     room           : { type: String },
     user           : { type: String },
     message        : { type: String },
     created_at     : { type: String },
})
