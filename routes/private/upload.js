const multer = require('multer')

const imageFilter = function (req, file, cb) {
    
    const allowedType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

    if(!allowedType.includes(file.mimtype)) {
        const error = new Error('Wrong file type')
        error.code = 'LIMIT_FILE_TYPES'
        return cb(error, false)
    }

    cb(null, true)
}

const uploadImage = multer({
    dest: './uploads/',
    imageFilter
})

module.exports = function (api) {

    api.post('/upload', upload.single('file') , (req,res) => {
        res.json({file: req.file})
    })

    api.post('/image', uploadImage.single('file'), (req, res) => {
        res.json({file: req.file})
    })

}