var mongoose = require('mongoose')

module.exports = mongoose.model('Post', {
    title: { type: String, required: true, unique: true },
    summary: { type: String, required: true},
    original: { type: String },
    body: { type: String, required: true },
    published: { type: Boolean },
    createdAt: { type: Number },
    updatedAt: { type: Number },
    publishedAt: { type: Date },
    category: { type: String },
    tags: { type: Array },
    user_id: { type: String, required: true },
    shared: { type: Boolean },
    lang: { type: String },
    wip: { type: Boolean },
    feat: { type: Boolean },
    important: { type: Boolean },
    site: { type: Array }
})