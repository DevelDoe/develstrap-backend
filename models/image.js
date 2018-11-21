var mongoose = require('mongoose')

module.exports = mongoose.model('Image', {
    title       : { type: String, required: true },
    summary     : { type: String },
    published   : { type: Boolean },
    createdAt   : { type: Number },
    updatedAt   : { type: Number },
    publishedAt : { type: Date },
    tags        : { type: Array },
    user_id     : { type: String },
    private      : { type: Boolean },
    feat        : { type: Boolean },
    images      : { type: Array }
})