"use strict";

const { ExpressError } = require("../errors/expressErrors");
const { SECRET_KEY } = require('../configs/configurations');
const jwt = require('jsonwebtoken');


const authenticateJWT = (req, res, next) => {
    try{
        const payload = jwt.verify(req.body.jwt_token, SECRET_KEY);
        req.user = payload;
        return next();
    }catch(err){
        return next();
    }
}


function ensureLoggedIn(req, res, next){
    if(!req.user){
        return next(new ExpressError("Unauthorized! You must be logged in!", 401));
    }else{
        return next();
    }
}


function ensureAdmin(req, res, next){
    if(!req.user){
        return next(new ExpressError("Unauthenticated! You cannot create or update users."));
    }
    if(req.user.is_Admin !== true){ 
        return next(new ExpressError("Unauthorized! You must be an admin", 401));
    }
    return next();
}


module.exports = { authenticateJWT, ensureLoggedIn, ensureAdmin };