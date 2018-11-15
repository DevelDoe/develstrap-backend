const multer    = require('multer')
const sharp     = require('sharp')
const fs        = require('fs')

const imageFilter = function (req, file, cb) {
    
    const allowedType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

    if(!allowedType.includes(file.mimetype)) {
        const error = new Error('Wrong file type')
        error.code = 'LIMIT_FILE_TYPES'
        return cb(error, false)
    }

    cb(null, true)
}

const MAX_IMAGE_SIZE = 1024 * 1024 * 5 // 5 MB

const uploadFile = multer({
    dest: './uploads/',
})

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
        res.json({files: req.files})
    })

    api.post('/image', uploadImage.single('file'), async (req, res) => {
        try {
            await sharp(req.file.path)
                .resize(300)
                .background('white')
                .embed()
                .toFile(`./static/${req.file.originalname}`)
            fs.unlink(req.file.path, () => {
                res.json({ file: `./static/${req.file.originalname}` })
            })
        } catch (err) {
            res.status(422).json({err})
        }
    })

    api.post('/images', uploadImage.array('files'), (req, res) => {
        res.json({ files: req.files })
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

