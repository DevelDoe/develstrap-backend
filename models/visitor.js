var mg = require('mongoose')

module.exports = mg.model('Visitor', {
    ip: { type: String },
    city: { type: String },
    country: { type: String },
    region: { type: String },
    timezon: { type: String },
    date: { type: Number },
    seconds: { type: Number },
    page: { type: String },
    app: { type: String},
    user_id: { type: String},
    resolution: { type: String }
})