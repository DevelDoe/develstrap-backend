var mg = require('mongoose')

module.export = mg.model('Visitor', {
    ip: { type: String },
    date: { type: Number },
    page: { type: String }
})