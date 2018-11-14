var mongoose = require('mongoose')

module.exports = mongoose.model('Photo', {
    title       : { type: String },
    summary     : { type: String },
    published   : { type: Boolean },
    createdAt   : { type: Number },
    updatedAt   : { type: Number },
    publishedAt : { type: Date },
    tags        : { type: Array },
    artist_id   : { type: String },
    shared      : { type: Boolean },
    feat        : { type: Boolean },
    photos      : { type: Array }
})