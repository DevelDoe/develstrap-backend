const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../../models/user')
const config = require('../../config')
const router = express.Router()


/* 
http://localhost:4000/public/register POST
{
    "username": "testuser",
    "password": "password123",
    "email": "test@example.com",
    "sec_lv": "1",
    "administrations:" "["users","data"]",
    "applications:" "["settings"]"
} 
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
*/
router.post('/register', async (req, res) => {
    try {
        const { password, email, sec_lv } = req.body

        // Ensure all required fields are present
        if (!password || !email || !sec_lv) {
            return res.status(400).json({ message: 'fields required: email, password, sec_lv' })
        }

        // Check if the user already exists
        let user = await User.findOne({ 'email': email  })
        if (user) {
            return res.status(400).json({ message: 'User already exists' })
        }

        // No need to manually hash the password here, let the pre('save') hook handle it
        user = new User({ password, email, sec_lv })
        await user.save()

        res.status(201).json({ message: 'User registered successfully' })
    } catch (err) {
        console.error('[REGISTER ERROR]:', err)
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})


// User login
router.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body

        // If there is no root user create it
        let root = await User.findOne({'email': email })

        if (!root) {
            root = new User()
            root.username = 'root'
            root.email = 'root@toor.me'
            root.password = 'asdf'
            root.sec_lv = 0
            root.administrations = ['users', 'data']
            root.applications = ['settings', 'todos']
            root.save(err => {
                if (err) {
                    console.error(res, err)
                    return
                }
            })
        }

        // Find the user by username
        const user = await User.findOne({'email': email })

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        // Compare the provided password with the stored hash
        user.comparePassword(password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing password:', err)
                return res.status(500).json({ message: 'Server error' })
            }

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid email or password' })
            }

/*             // Define the payload
            const payload = {
                _id: user.id,
                username: user.username,
                email: user.email,
                sec_lv: user.sec_lv,
                administrations: user.administrations,
                applications:user.applications,
                supports:user.supports,
                forums:user.forums
            } */

            // Generate a JWT token if the password matches
            const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '1h' })
            res.status(200).json({ user,  token: 'Bearer ' + token })
        })

    } catch (err) {
        console.error('[LOGIN ERROR]:', err)
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

// Logout Route (POST /public/logout)
router.post('/logout', async (req, res) => {
    try {
        res.json({ msg: 'Logged out' });
        res.end()
    } catch (err) {
        return res.status(500).json({ msg: 'Server error during logout process' });
    }
});

module.exports = router