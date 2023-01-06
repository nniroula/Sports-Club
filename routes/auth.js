"use strict";

const express = require('express');
const db = require('../db');  
const { ExpressError } = require("../errors/expressErrors");
// const { SECRET_KEY } = require('../configs/configurations');
const { SECRET_PASS } = require('../configs/configurations');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = new express.Router();

router.post('/login', async function(req, res, next){
    try{
        const { username, password } = req.body;

        if(!username || !password){
            return res.status(400).json(new ExpressError(`Valid username and password are required`, 400));
        }
        
        const result = await db.query(`SELECT username, password, is_admin FROM users WHERE username = $1`, [username]);
        const user = result.rows[0];
        const is_Admin = user.is_admin;
    
        if(user){
            if(await bcrypt.compareSync(password, user.password)){
                const jwt_token = jwt.sign({username: username, is_Admin: is_Admin}, SECRET_PASS);
                return res.json({username: username, is_admin: is_Admin, jwt_token: jwt_token});
            }
        }
        return res.status(400).json(new ExpressError("Invalid username or password", 400));
    }catch(e){
        return next(e);
    }
})


module.exports = router;