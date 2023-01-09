const express = require('express');
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
//ROUTE 1:Create a User using : POST "/api/auth/createuser".No login required
const JWT_SECRET = 'Hello'
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    //If there are errors, return bad require and the errors
    var success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success,errors: errors.array() });
    }

    try {
        // Check weather the user with this email exists already
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({ success, error: "Sorry a user with this email already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        let secPass = await bcrypt.hash(req.body.password, salt);//req.body.password
        // console.log(secPass);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })

        const data = {
            user: {
                id: user.id
            }
        }

        var authtoken = jwt.sign(data, JWT_SECRET);
        // console.log(authtoken);
        success = true
        res.json({ success, authtoken })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }


})


// ROUTE 2 :Authenticate a user using: POST "/api/auth/login" .No login required  

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    var success = false

    //If there are errors, return bad require and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }

    // Destructute the req.body 

    const { email, password } = req.body;

    try {
        // let user = await User.findOne({ email: req.body.email });
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials" })
        }

        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials" })
        }

        const data = {
            user: {
                id: user.id
            }
        }

        var authtoken = jwt.sign(data, JWT_SECRET);
        // console.log(authtoken);
        success = true
        res.json({ success, authtoken })

        // res.json({authtoken})

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }

})


// ROUTE 3 :get loggedin User Details using: POST "/api/auth/getuser" .Login required  

router.post('/getuser', fetchuser, async (req, res) => {

    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select("-password")
        res.json({ user })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }

})

module.exports = router;
