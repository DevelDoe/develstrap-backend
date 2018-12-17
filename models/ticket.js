var mongoose = require('mongoose')
module.exports = mongoose.model('Ticket', {
     title: {
          type: String
     },
     category: {
          type: String
     },
     steps: {
          type: Array
     },
     created_at: {
          type: String
     },
     updated_at: {
          type: String
     },
     deleted: {
          type: Boolean
     },
     result: {
          type: String
     },
     expected: {
          type: String
     }, 
     workaround: {
          type: String
     },
     repro: {
          type: Array
     }
})
