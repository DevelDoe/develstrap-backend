var mg = require('mongoose')

module.export = mg.model('Visitor', {
    ip: { type: String },
    seconds: { type: Number },
    page: { type: String },
    app: { type: String},
    user_id: { type: Strign}
})