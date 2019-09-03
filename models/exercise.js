var mongoose = require('mongoose')
module.exports = mongoose.model('Exercise', {
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
     target: {
       type: Number
     },
     created_at: {
          type: String
     },
     updated_at: {
          type: String
     },
})
