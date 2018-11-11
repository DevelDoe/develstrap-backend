var mg = require('mongoose')

module.exports = mg.model('Visitor', {
    ip: { type: String },
    date: { type: Number },
    seconds: { type: Number },
    page: { type: String },
    app: { type: String},
    user_id: { type: String}
})