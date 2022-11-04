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

const { authenticateJWT, ensureLoggedIn } = require('../middleware/auth');

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
                const jwt_token = jwt.sign({username, is_Admin}, SECRET_KEY);
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
        const token = req.body.jwt_token;   // || req.user.header.jwt_token;
        const payload = jwt.verify(token, SECRET_KEY);
        return res.json({msg: "Access Allowed"});
        // return res.json({payload});
    }catch(e){
        // console.log(e);
        return next(new ExpressError("Please log in", 401));
    }
})

// logout route
router.post("/logout", authenticateJWT, function (req, res){
// router.post("/logout", authenticateJWT, ensureLoggedIn, function (req, res){
    // const authHeader = req.headers["authorization"];
    // const authToken = req.body.jwt_token;
    // const authToken = req.user.token;
    // console.log(authToken);
    // jwt.sign(authHeader, "", { expiresIn: 1 } , (logout, err) => {
//    jwt.sign(authToken, "", { expiresIn: 1 } , (logout, err) => {
//     if (logout) {
//         return res.send({msg : 'Logged Out Successfully' });
//          return res.json({jwt_token});
//     } else {
//         res.send({msg:'Error'});
//     }
//     });
    // authToken = undefined;
    
    // req.user.jwt_token = undefined;
    req.body.jwt_token = undefined;
    console.log(`token should be undefiend ${req.body.jwt_token}`);
    // const newToken = jwt.sign(authToken, undefined);
    return res.send("log out");
    // return res.send({msg: "log out", newToken});
});


module.exports = router;