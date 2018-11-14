const multer = require('multer')

const upload = multer({
    dest: './uploads/'
})

module.exports = function (api) {

    api.post('/upload', upload.single('file') , (req,res) => {
        res.json({file: req.file})
    })

    api.post('/image', upload.single('file') , (req,res) => {
        res.json({file: req.file})
    })

}