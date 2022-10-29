// sign in, sign up, login, log out routes
// sign up is create user


"use strict";


const express = require('express');
const jsonschema = require('jsonschema');
const userSchema = require('../schemas/userSchema');
const db = require('../db');  
const User = require('../models/userClass');
const { BadRequestError, ConflictError, NotFoundError, ExpressError } = require("../errors/expressErrors");
const { BCRYPT_WORK_FACTOR } = require('../configs/configurations');
const bcrypt = require('bcrypt');

const router = new express.Router();


// authenticaion is done by comparing the hashed password. Next approach, use JWT to authenticate
router.post('/:login', async function(req, res, next){
    try{
        const { username, password } = req.body;

        // validate if it is a correct username and password
        if(!username || !password){
            return res.status(400).json(new ExpressError(`Valid username and password are required`, 400));
        }
        // password below is hashed_password in database
        const result = await db.query(`SELECT username, password FROM users WHERE username = $1`, [username]);
        const user = result.rows[0];
        console.log(user.username);
        if(user){
            // compare the password, and allow login, compare creates a hashed password and compares it to the user credentials
            if(await bcrypt.compare(password, user.password)){
                return res.json("logged in successfully");
            }
        }
        return res.status(400).json(new ExpressError("Invalid username or password", 400));
    
    }catch(e){
        return next(e);
    }
})


module.exports = router;