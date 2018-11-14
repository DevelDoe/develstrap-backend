const multer   = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5  }, // 5 MB
    fileFilter: fileFilter
}).single('img_src')

module.exports = function ( api ) {

 
    api.post('/',( req, res ) => {
        upload(req, res, (err) => {
            if( err ) {
                if(err) {
                    error(res, err)
                    return
                }
            }
            return res.json({ file: req.file })
        })
    })
    
    function error(res, err) {
        res.status(500)
        res.json({
            err: 'Server ' + err
        })
    }
}
