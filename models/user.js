const mongoose = require('mongoose'),
      bcrypt   = require('bcrypt')

var UserSchema = mongoose.Schema({
    fname           : { type: String  },
    lname           : { type: String  },
    username        : { type: String , trim: true, index: { unique: true, partialFilterExpression: { username: { $type: 'string' } } } },  
    password        : { type: String , required: true },
    email           : { type: String , unique: true , required: true },
    img_src         : { type: String },
    sec_lv          : { type: String, required: true },
    applications    : { type: Array },
    administrations : { type: Array },
    supports        : { type: Array },
    forums          : { type: Array },
    artist          : { type: Boolean }
})

UserSchema.pre('save', function (next) {
    var user = this
    if( this.isModified( 'password' ) || user.isNew ) {
        bcrypt.genSalt( 10 , ( err , salt ) => {
            if ( err ) return next( err )
            bcrypt.hash( user.password , salt , ( err , hash ) => {
                if ( err ) return next( err )
                user.password = hash
                next()
            })
        })
    } else {
        return next()
    }
})

UserSchema.methods.comparePassword = function (passwd, cb) {

    bcrypt.compare(passwd, this.password, (err, isMatched) => {
        if (err) return cb(err);
        cb(null, isMatched);
    });
};

module.exports = mongoose.model('User', UserSchema)