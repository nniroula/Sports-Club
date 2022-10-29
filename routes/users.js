// email validation, incomplete /(^[a-zA-Z]+|^[a-zA-Z]+[0-9]+)[@][a-zA-Z]+[.][a-zA-Z]+$/.test('q11@d.ai')


"use strict";

const { json } = require('express');
const express = require('express');
const jsonschema = require('jsonschema');
const userSchema = require('../schemas/userSchema');
const db = require('../db');  
const User = require('../models/userClass');
const { BadRequestError, ConflictError, NotFoundError } = require("../errors/expressErrors");

// import Bcrypt Work Factor
const { BCRYPT_WORK_FACTOR } = require('../configs/configurations');
// require bcrypt
const bcrypt = require('bcrypt');


const router = new express.Router();


// get all users
router.get('/', async function(req, res, next){
    try{
        const results = await User.getAllUsers();
        return res.json(results);
    }catch(e){
        return next(e);
    }
})


router.get('/admins', async function(req, res, next){
    try{
        const results = await User.getAllAdmins();
        return res.json(results);
    }catch(e){
        return next(e);
    }
})


// get a single user becomes /users/:id
router.get('/:id', async function(req, res, next){
    try{
        const result = await User.getUserById(req.params.id);
        if(result === "not found"){
            return res.status(404).json(new NotFoundError(`User with id of ${req.params.id} not found`, 404));
        }
        return res.json(result);
    }catch(e){
        return next(e);
    }
})


// post request // NEW Version with jsonschema becomes /users
router.post('/', async function(req, res, next){
    try{
        const validatedInput = jsonschema.validate(req.body, userSchema);
        if(!validatedInput.valid){
            const errs = validatedInput.errors.map(e => e.stack);
            return res.status(400).json(new BadRequestError(errs));  
        }
        // const { email, username} = req.body;
        const { first_name, last_name, username, password, email, phone_number, is_admin, start_date } = req.body;
        // hash the password before saving to the database
        // const hashed_password = bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        // password = bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        // password = hashed_password;

  
        const existingUserWithInputEmail = await User.getUserByEmail(email);
        const existingUserWithInputUsername = await User.getUserByUsername(username);

        if(existingUserWithInputUsername !== "Not Found"){
            return res.status(409).json(new ConflictError("Username is taken. Please use different one.", 409));
        }

        if(existingUserWithInputEmail !== "Not Found"){
            return res.status(409).json(new ConflictError("Email is taken. Please use different one.", 409));
        }
        
        // const user = User.createUser(req.body);
        const user = await User.createUser(first_name, last_name, username, password, email, phone_number, is_admin, start_date);
        // const user = await User.createUser(first_name, last_name, username, hashed_password, email, phone_number, is_admin, start_date);

      
        return res.status(201).json(user);
    }catch(e){
        return next(e);
    }
})


// update the user
router.put('/:id', async function(req, res, next){
    try{
        // validate with json schema for players
        const inputValidation = jsonschema.validate(req.body, userSchema);
        if(!inputValidation.valid){
            const errs = inputValidation.errors.map(e => e.stack);
            return res.status(400).json(new BadRequestError(errs)); 
        }
        // grab the input from the request body by destructuring the request body
        const { username, email } = req.body;
        // const { first_name, last_name, username, password, email, phone_number, is_admin, start_date } = req.body;

        // check if email belongs to a different user
        const existingUserWithInputEmail = await User.getUserByEmail(email);

        if(existingUserWithInputEmail !== "Not Found"){
            const idOfExistingUserWithEmail = existingUserWithInputEmail['id']
            // if(idOfExistingUserWithEmail !== Number(req.params.id)){
            if(idOfExistingUserWithEmail !== req.params.id){
                return res.status(409).json(new ConflictError("Email is taken! Try different one", 409));
            }
        }

        const existingUserWithInputUsername = await User.getUserByUsername(username);
        if(existingUserWithInputUsername !== "Not found"){
            const idOfExistingUserWithUsername = existingUserWithInputUsername['id'];
            if(idOfExistingUserWithUsername !== Number(req.params.id)){
                return res.status(409).json(new ConflictError("Username is taken! Try different one", 409));
            }
        }

        console.log("GOOD HERE ----------------------------");
        // ERORR IS RAISED HERE Error in postman is  "message": "syntax error at or near \"email\"",
    
        // const userToBeUpdated = await User.updateUser(req.params.id, first_name, last_name, username, password, email, phone_number, is_admin, start_date);
        const userToBeUpdated = await User.updateUser(req.params.id, req.body);

        console.log("GOOD HERE AGAIN ----------------------------");
        // debugger;
        return res.json(userToBeUpdated);

    }catch(e){
        return next(e);
    }
})


// delete a user, later on archieve it
router.delete('/:id', async function(req, res, next){
    try{
        // destructure the request params, and get the id
        const id = req.params.id;
        const result = await User.deleteUser(id); 
        res.json(result);
    }catch(e){
        return next(e);
    }
})

module.exports = router;
