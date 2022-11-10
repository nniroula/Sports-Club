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

// const router = new express.Router();


// Authentication using Json Web token(JWT)


// const jwt_token = jwt.sign({username, is_Admin}, SECRET_KEY); in middleware auth.js

// authenticateJWT function, use this function in protected route
const authenticateJWT = (req, res, next) => {
    try{
        const payload = jwt.verify(req.body.jwt_token, SECRET_KEY);
        req.user = payload;
        // console.log(`in authenticate route ${req.user.username}, ${req.user.is_Admin}`); // works
        return next();
    }catch(err){
        return next();
    }
}

// function to make sure that a user is logged in
function ensureLoggedIn(req, res, next){
    // console.log(`in ensuredLogg in func ${req.user.username}, ${req.user.is_Admin}`); // works
    if(!req.user){
        return next(new ExpressError("Unauthorized! You must be logged in!", 401));
    }else{
        // console.log(`jwt token is ${req.body.jwt_token}`);
        return next();
    }
}

// const jwt_token = jwt.sign({username, is_Admin}, SECRET_KEY); in middleware auth.js
function ensureAdmin(req, res, next){
    // console.log(req.user.is_Admin !== true);
    if(req.user.is_Admin !== true){ 
        // console.log(`YOU MUST ADMIN:::::: ${req.user.is_Admin}`);
        return next(new ExpressError("Unauthorized! You must be an admin", 401));
        // return next();
    }
    // console.log("After the if condition in ensure admin func ---------------- ");
    return next();
}


module.exports = { authenticateJWT, ensureLoggedIn, ensureAdmin };