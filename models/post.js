import {mongoose} from 'mongoose'

module.exports = mongoose.model('Post', {
    title: { type: String, required: true, unique: true },
     summary: { type: String, required: true},
     original: { type: String, required: false },
     body: { type: String, required: true },
     published: { type: Boolean },
     createdAt: { type: Number },
     updatedAt: { type: Number },
     category: { type: String },
     tags: { type: Array }
})