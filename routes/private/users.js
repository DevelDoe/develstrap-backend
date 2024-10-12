const express = require('express');
const router = express.Router(); // Use Express Router
const User = require('../../models/user');
const { verifyToken } = require('../../middleware'); // Import authentication middleware

// GET all users
router.get('/', verifyToken, (req, res) => {
    User.find((err, users) => {
        if (err) {
            return error(res, err);
        }
        res.json(users);
    });
});

// POST a new user
router.post('/', verifyToken, (req, res) => {
    const user = new User();
    user.fname = req.body.fname;
    user.lname = req.body.lname;
    if (req.body.username !== '') user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    user.img_src = req.body.img_src || '/uploads/images/processed/default.jpg';
    user.sec_lv = req.body.sec_lv;
    user.applications = req.body.applications;
    user.administrations = req.body.administrations;
    user.supports = req.body.supports;
    user.forums = req.body.forums;
    user.artist = req.body.artist;

    user.save(err => {
        if (err) {
            return error(res, err);
        }
        res.json(user);
    });
});

// DELETE a user by ID
router.delete('/:_id', verifyToken, (req, res) => {
    User.remove({ _id: req.params._id }, (err) => {
        if (err) {
            return error(res, err);
        }
        res.sendStatus(200);
    });
});

// PUT to update a user by ID
router.put('/:_id', verifyToken, (req, res) => {
    User.findById(req.params._id, (err, user) => {
        if (err) {
            return error(res, err);
        }

        user.fname = req.body.fname;
        user.lname = req.body.lname;
        if (req.body.username !== '') user.username = req.body.username;
        user.email = req.body.email;
        user.password = req.body.password;
        user.img_src = req.body.img_src || '/uploads/images/processed/default.jpg';
        user.sec_lv = req.body.sec_lv;
        user.applications = req.body.applications;
        user.administrations = req.body.administrations;
        user.supports = req.body.supports;
        user.forums = req.body.forums;
        user.artist = req.body.artist;

        user.save(err => {
            if (err) {
                return error(res, err);
            }
            res.json(user);
        });
    });
});

// Centralized error handling function
function error(res, err) {
    res.status(500).json({
        err: 'Server error: ' + err
    });
}

// Export the router
module.exports = router;
