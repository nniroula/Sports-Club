"use strict";


const express = require('express');
const jsonschema = require('jsonschema');
const userSchema = require('../schemas/userSchema');
const db = require('../db');  
const User = require('../models/userClass');
const { BadRequestError, ConflictError, NotFoundError, ExpressError } = require("../errors/expressErrors");
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require('../configs/configurations');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const { authenticateJWT, ensureLoggedIn, ensureAdmin } = require('../middleware/auth');

const router = new express.Router();


// for user login
router.post('/login', async function(req, res, next){
    try{
        const { username, password } = req.body;

        if(!username || !password){
            return res.status(400).json(new ExpressError(`Valid username and password are required`, 400));
        }
        // password below is hashed_password in database
        // const result = await db.query(`SELECT username, password FROM users WHERE username = $1`, [username]);
        const result = await db.query(`SELECT username, password, is_admin FROM users WHERE username = $1`, [username]);
        const user = result.rows[0];

        const is_Admin = user.is_admin;
    
        if(user){
            // compare the password, and allow login, compare creates a hashed password and compares it to the user credentials
            if(await bcrypt.compare(password, user.password)){
                // const jwt_token = jwt.sign({username, is_Admin}, SECRET_KEY);
                const jwt_token = jwt.sign({username: username, is_Admin: is_Admin}, SECRET_KEY);
                // return res.json({message: "logged in successfully!", jwt_token});
                // try this
                // req.user.token = jwt_token;
                return res.json({jwt_token});
            }
        }
        return res.status(400).json(new ExpressError("Invalid username or password", 400));
    
    }catch(e){
        return next(e);
    }
})


router.get('/secret', authenticateJWT, ensureLoggedIn, (req, res, next) => {
    // console.log(JSON.stringify(req.body));
    try{
        return res.json({msg: "Access Allowed"});
    }catch(e){
        // console.log(e);
        return next(new ExpressError("Please log in", 401));
    }
})

// check admin route
// router.get('/admin', authenticateJWT, ensureLoggedIn, ensureAdmin, (req, res, next) => {
router.get('/admin', authenticateJWT, ensureAdmin, (req, res, next) => { // authenticateJWT is needed
    try{
        console.log("HIT this admin");
        return res.json({msg: `You have admin rights`});
    }catch(e){
        return next(new ExpressError("You must be admin", 401));

    }

})


module.exports = router;