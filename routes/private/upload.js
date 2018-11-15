const multer = require('multer')

const imageFilter = function (req, file, cb) {
    
    const allowedType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

    console.log('here')

    if(!allowedType.includes(file.mimtype)) {
        const error = new Error('Wrong file type')
        error.code = 'LIMIT_FILE_TYPES'
        return cb(error, false)
    }

    cb(null, true)
}

const uploadFile = multer({
    dest: './uploads/',
})

const uploadImage = multer({
    dest: './uploads/',
    fileFilter: imageFilter
})

module.exports = function (api) {

    api.post('/upload', uploadFile.single('file') , (req,res) => {
        res.json({file: req.file})
    })

    api.post('/image', uploadImage.single('file'), (req, res) => {
        res.json({file: req.file})
    })

    api.use((err, req, res, next) => {
        if (err.code === 'LIMIT_FILE_TYPES') {
            res.status(422).json({
                error: 'Only images are allowed'
            })
            return
        }
    })

}

