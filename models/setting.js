var mongoose = require('mongoose')
module.exports = mongoose.model('Setting', {
    user_id:    { type: String },
    sites:      { type: Array },
    created_at: { type: String },
    updated_at: { type: String },
})