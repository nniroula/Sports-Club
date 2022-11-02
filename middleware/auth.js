// sign in, sign up, login, log out routes
// sign up is create user


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

const { SECRET_KEy } = require('../configs/configurations');



const router = new express.Router();


// authenticaion is done by comparing the hashed password. Next approach, use JWT to authenticate
// router.post('/:login', async function(req, res, next){
//     try{
//         const { username, password } = req.body;

//         if(!username || !password){
//             return res.status(400).json(new ExpressError(`Valid username and password are required`, 400));
//         }
//         // password below is hashed_password in database
//         const result = await db.query(`SELECT username, password FROM users WHERE username = $1`, [username]);
//         const user = result.rows[0];

//         if(user){
//             // compare the password, and allow login, compare creates a hashed password and compares it to the user credentials
//             if(await bcrypt.compare(password, user.password)){
//                 return res.json("logged in successfully!");
//             }
//         }
//         return res.status(400).json(new ExpressError("Invalid username or password", 400));
    
//     }catch(e){
//         return next(e);
//     }
// })


// Authentication using Json Web token(JWT)

router.post('/:login', async function(req, res, next){
    try{
        const { username, password } = req.body;

        if(!username || !password){
            return res.status(400).json(new ExpressError(`Valid username and password are required`, 400));
        }
        // password below is hashed_password in database
        // const result = await db.query(`SELECT username, password FROM users WHERE username = $1`, [username]);
        const result = await db.query(`SELECT username, password, is_admin FROM users WHERE username = $1`, [username]);

        const user = result.rows[0];

        console.log(user);
        const is_Admin = user.is_admin;
        console.log(`Is Admin is ${is_Admin}`);
    
   
        if(user){
            // compare the password, and allow login, compare creates a hashed password and compares it to the user credentials
            if(await bcrypt.compare(password, user.password)){
                // return res.json("logged in successfully!");
                // const token = jwt.sign({username, is_admin}, SECRET_KEY);
                const jwt_token = jwt.sign({username, is_Admin}, SECRET_KEY);
                // console.log(jwt_token);
                return res.json({message: "logged in successfully", jwt_token});
            }
        }
        return res.status(400).json(new ExpressError("Invalid username or password", 400));
    
    }catch(e){
        return next(e);
    }
})


module.exports = router;