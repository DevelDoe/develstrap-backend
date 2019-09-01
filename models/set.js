var mongoose = require('mongoose')
module.exports = mongoose.model('Set', {
     group: {
          type: String
     },
     name: {
          type: String
     },
     weight: {
          type: Number
     },
     repetitions: {
        type: Number
     },
     created_at: {
          type: String
     },
     updated_at: {
          type: String
     },
})
