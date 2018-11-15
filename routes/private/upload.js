const multer = require('multer')

const imageFilter = function (req, file, cb) {
    
    const allowedType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

    if(!allowedType.includes(file.mimetype)) {
        const error = new Error('Wrong file type')
        error.code = 'LIMIT_FILE_TYPES'
        return cb(error, false)
    }

    cb(null, true)
}

const uploadFile = multer({
    dest: './uploads/',
})

const MAX_IMAGE_SIZE = 1024 * 1024 * 5 // 5 MB

const uploadImage = multer({
    dest: './uploads/',
    fileFilter: imageFilter,
    limits: { fileSize:  MAX_IMAGE_SIZE }, 
})

module.exports = function (api) {

    api.post('/file', uploadFile.single('file') , (req,res) => {
        res.json({file: req.file})
    })

    api.post('/files', uploadFile.array('files') , (req,res) => {
        res.json({file: req.files})
    })

    api.post('/image', uploadImage.single('image'), (req, res) => {
        res.json({ image: req.image })
    })

    api.post('/images', uploadImage.array('images'), (req, res) => {
        console.log(req.images)
        res.json({ images: req.images })
    })

    api.use((err,req,res,next)=>{
        if(err.code === 'LIMIT_FILE_TYPES') {
            res.status(422).json({ error: 'Only images are allowed'})
            return
        }
        if(err.code === 'LIMIT_FILE_SIZE') {
            res.status(422).json({ error: `File is to large. max size is ${MAX_IMAGE_SIZE / 1000}kB`})
            return
        }
    })

}

