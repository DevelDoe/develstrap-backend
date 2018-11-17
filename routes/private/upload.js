const multer    = require('multer')
const sharp     = require('sharp')
const fs        = require('fs')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/images/raw/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

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


const uploadImage = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: { fileSize:  MAX_IMAGE_SIZE }, 
})

module.exports = function (api) {

    api.post('/image', uploadImage.single('file'), async (req, res) => {
        try {
            await sharp(req.file.path)
                .resize(300)
                .background('transparent')
                .embed()
                .toFile(`./uploads/images/processed/${req.file.originalname}`)
            res.json({ file: `/uploads/images/processed/${req.file.originalname}` })
        } catch (err) {
            res.status(422).json({err})
        }
    })

    api.post('/images', uploadImage.array('files'), (req, res) => {
        res.json({ files: req.files })
    })

    api.post('/avatar', uploadImage.single('file'), async (req, res) => {
        try {
            await sharp(req.file.path)
                .resize(35,35)
                .background('rgba(0,0,0,0)')
                .inside()
                .toFile(`./uploads/images/processed/${req.file.originalname}`)
            res.json({ file: `/uploads/images/processed/${req.file.originalname}` })
        } catch (err) {
            res.status(422).json({err})
        }
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

