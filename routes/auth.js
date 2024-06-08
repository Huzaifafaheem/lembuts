const express = require("express")
const routes = express.Router()
const User = require("../models/User")
const fetchuser = require("../middleware/fetchUser")

const { body, validationResult } = require("express-validator")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()


const JWT_SECREY = process.env.JWT_SECREY
// console.log(JWT_SECREY);


//ROUTE 1 : create a User using : post "/api/auth/createuser". No login required 
routes.post("/createuser", [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'password must be atleast five characters').isLength({ min: 5 })
], async (req, res) => {
    let success = false;

    //if there are errors, return bad request and the errors

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // in case request params meet the validation criteria
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        // Check whether the user with this email exists already

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "User already exists." })
        }
        const salt = await bcrypt.genSalt(10);
        let secPass = await bcrypt.hash(req.body.password, salt);
        // console.log(user);
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        });

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECREY)
        success = true
        res.json({ success, authtoken })

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})





//ROUTE 2 : authentication a User using : post "/api/auth/login". No login required 

routes.post("/login", [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'password cannot be blank').exists()
], async (req, res) => {

    //if there are errors, return bad request and the errors

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        success = false;
        // in case request params meet the validation criteria
        return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {

        let user = await User.findOne({ email });
        if (!user) {
            success = false;
            return res.status(400).json({ success, error: "please try to login with correct credentials" })
        }


        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            success = false;
            return res.status(400).json({ success, error: "please try to login with correct credentials" })
        }


        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECREY)
        success = true;
        res.json({ success, authtoken })

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// ROUTE 3 : Get loggedin User Details using : post "/api/auth/getuser". login required

routes.post("/getuser", fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

})



module.exports = routes;