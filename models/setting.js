var mongoose = require('mongoose')
module.exports = mongoose.model('Setting', {
    user_id:    { type: String },
    sites:      { type: Array },
    port:       { type: Number },
    ingress:    { type: String },
    image:      { type: String },
    created_at: { type: String },
    updated_at: { type: String },
})