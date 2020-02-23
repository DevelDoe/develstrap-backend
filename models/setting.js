var mongoose = require('mongoose')
module.exports = mongoose.model('Setting', {
    user_id:    { type: String },
    sites:      { type: Object }
})