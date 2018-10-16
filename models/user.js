const mongoose = require('mongoose'),
      bcrypt   = require('bcrypt')

let UserScema = new mongoose.Schema({
    fname     : { type: String  },
    lname     : { type: String  },
    username  : { type: String , unique: true },
    password  : { type: String , required: true },
    email     : { type: String , unique: true , required: true },
    image_src : { type: String },
    role      : { type: Number }
})

UserScema.pre( 'save', function(next) {
    var user = this
    if (this.isModified('password') || user.isNew) {
        bcrypt.genSalt(10, ( err, salt ) => {
            if( err ) return next( err )
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        return next()
    }
})

UserScema.methods.comparePassword = function(passwd, cb) {
    bcrypt.compare(passwd, this.password, (err, isMatched) => {
        if (err) return cb(err)
        cb(null, isMatched)
    })
}

module.exports = mongoose.model('User', UserScema)
