var mg = require('mongoose')

module.exports = mg.model('Visitor', {
    ip: { type: String },
    seconds: { type: Number },
    page: { type: String },
    app: { type: String},
    user_id: { type: String}
})