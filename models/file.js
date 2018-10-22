var mongoose = require('mongoose')

module.exports = mongoose.model('Image', new mongoose.Schema({
    img: { data: Buffer, contentType: String}
}))
