var mongoose = require('mongoose')
module.exports = mongoose.model('Setting', {
    website:    { type: String },
    port:       { type: Number },
    ingress:    { type: String },
    image:      { type: String },
    created_at: { type: String },
    updated_at: { type: String },
})