"use strict";

const express = require('express');
const jsonschema = require('jsonschema');
const userSchema = require('../schemas/userSchema');
const User = require('../models/userClass');
const { BadRequestError, ConflictError, NotFoundError, ExpressError } = require("../errors/expressErrors");
const bcrypt = require('bcrypt');
const {authenticateJWT, ensureAdmin, ensureLoggedIn} = require('../middleware/auth')

const router = new express.Router();

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

router.get('/admins/:username', async function(req, res, next){
    try{
        const result = await User.getAdminByUsername(req.params.username);
        if(result === "Not Found"){
            return res.status(404).json(new NotFoundError(`User with username of ${req.params.username} not found`, 404));
        }
        return res.json(result);
    }catch(e){
        return next(e);
    }
})

router.get('/passwords/codes', async function(req, res, next){
    try{
        const results = await User.getAllPasswords();
        return res.json(results);
    }catch(e){
        return next(e);
    }
})

router.post('/', async function(req, res, next){
    try{
        const validatedInput = jsonschema.validate(req.body, userSchema);
        if(!validatedInput.valid){
            const errs = validatedInput.errors.map(e => e.stack);
            return res.status(400).json(new BadRequestError(errs));  
        }
        const { first_name, last_name, username, password, email, phone_number, is_admin, start_date } = req.body;
        const existingUserWithInputEmail = await User.getUserByEmail(email);
        const existingUserWithInputUsername = await User.getUserByUsername(username);

        if(existingUserWithInputUsername !== "Not Found"){
            return res.status(409).json(new ConflictError("Username is taken. Please use different one.", 409));
        }
        if(existingUserWithInputEmail !== "Not Found"){
            return res.status(409).json(new ConflictError("Email is taken. Please use different one.", 409));
        }
        if(is_admin === "true"){
            return res.status(401).json(new ConflictError("Unauthorized! You cannot create admin user.", 401));
        }
        const user = await User.createUser(first_name, last_name, username, password, email, phone_number, is_admin, start_date);
        return res.status(201).json(user);
    }catch(e){
        return next(e);
    }
})

router.put('/:id', authenticateJWT, ensureLoggedIn, async function(req, res, next){
    try{
        const inputValidation = jsonschema.validate(req.body, userSchema);
        if(!inputValidation.valid){
            const errs = inputValidation.errors.map(e => e.stack);
            return res.status(400).json(new BadRequestError(errs)); 
        }
        const { first_name, last_name, username, password, email, phone_number, is_admin, start_date } = req.body;
        const existingUserWithInputEmail = await User.getUserByEmail(email);
        if(existingUserWithInputEmail !== "Not Found"){
            const idOfExistingUserWithEmail = existingUserWithInputEmail['id'];
            if(idOfExistingUserWithEmail !== Number(req.params.id)){
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
        if(is_admin === "true"){
            return res.status(401).json(new ConflictError("Unauthorized! You cannot update to be an admin user.", 401));
        }
        const comparePassword = await bcrypt.compare(password, existingUserWithInputUsername.password);
        if(!comparePassword){
            return res.status(403).json(new ExpressError("Invalid password! You cannot update password!", 403));
        }else{
            const userToBeUpdated = await User.updateUser(req.params.id, first_name, last_name, username, existingUserWithInputUsername.password, email, phone_number, is_admin, start_date);
            return res.json(userToBeUpdated);
        }
    }catch(e){
        return res.status(400).json(new ExpressError("One or more invalid input type!", 400));
    }
})

router.delete('/:id', async function(req, res, next){
    try{
        const id = req.params.id;
        const result = await User.deleteUser(id); 
        res.json(result);
    }catch(e){
        return next(e);
    }
})

router.post('/admin', authenticateJWT, ensureLoggedIn, ensureAdmin, async function(req, res, next){
    try{
        const validatedInput = jsonschema.validate(req.body, userSchema);
        if(!validatedInput.valid){
            const errs = validatedInput.errors.map(e => e.stack);
            return res.status(400).json(new BadRequestError(errs));  
        }
        const { first_name, last_name, username, password, email, phone_number, is_admin, start_date } = req.body;
         if(is_admin.toLowerCase() !== "true"){ 
            return res.status(400).json(new ExpressError("Invalid input! Check is_admin value.", 400));
        }
        const existingUserWithInputEmail = await User.getUserByEmail(email);
        const existingUserWithInputUsername = await User.getUserByUsername(username);
        if(existingUserWithInputUsername !== "Not Found" && existingUserWithInputUsername.is_admin === true){
            return res.status(409).json(new ConflictError("Username is taken. Please use different one.", 409));
        }
        if(existingUserWithInputEmail !== "Not Found" && existingUserWithInputEmail.is_admin == true){
            return res.status(409).json(new ConflictError("Email is taken. Please use different one.", 409));
        }
        const user = await User.createUser(first_name, last_name, username, password, email, phone_number, is_admin, start_date);
        return res.status(201).json(user);
    }catch(e){
        return next(e);
    }
})

router.delete('/admin/:id', authenticateJWT, ensureLoggedIn, ensureAdmin, async function(req, res, next){
    try{
        const user = await User.getAdminByUsername(req.user.username);
        if(user.id === Number(req.params.id)){
            return res.status(409).json(new ExpressError("You cannot delete yourself!", 409));
        }else{
            const result = await User.deleteUser(req.params.id); 
            res.json(result);
        }
    }catch(e){
        return next(e);
    }
})

router.put('/admin/:id', authenticateJWT, ensureLoggedIn, ensureAdmin, async function(req, res, next){
    try{
        const inputValidation = jsonschema.validate(req.body, userSchema);
        if(!inputValidation.valid){
            const errs = inputValidation.errors.map(e => e.stack);
            return res.status(400).json(new BadRequestError(errs)); 
        }
        const loggedInUser = await User.getAdminByUsername(req.user.username);

        if(loggedInUser.id !== Number(req.params.id)){
            return res.status(401).json(new ConflictError("Unauthorized! You cannot update another admin.", 401));
        }
        const { first_name, last_name, username, password, email, phone_number, is_admin, start_date } = req.body;
        const existingAdminWithInputUsername = await User.getAdminByUsername(username);
        const existingAdminWithInputEmail = await User.getAdminByEmail(email);


        if(existingAdminWithInputEmail !== "Not Found"){
            const idOfExistingAdminWithEmail = existingAdminWithInputEmail['id'];
            if(idOfExistingAdminWithEmail !== Number(req.params.id)){
                return res.status(409).json(new ConflictError("Email is taken! Try different one", 409));
            }
        }
        if(existingAdminWithInputUsername !== "Not Found"){
            const idOfExistingAdminWithUsername = existingAdminWithInputUsername['id'];
            if(idOfExistingAdminWithUsername !== Number(req.params.id)){
                return res.status(409).json(new ConflictError("Username is taken! Try different one", 409));
            }
        }
        if(is_admin.toLowerCase() === "false"){
            return res.status(401).json(new ConflictError("Sorry! You cannot modify admin status.", 401));
        }

        const comparePassword = await bcrypt.compare(password, loggedInUser.password);

        if(!comparePassword){
            return res.status(403).json(new ExpressError("Invalid password! Enter a valid password!", 403));
        }else{
            const userToBeUpdated = await User.updateUser(req.params.id, first_name, last_name, username, loggedInUser.password, email, phone_number, is_admin, start_date);
            return res.json(userToBeUpdated);
        }
    }catch(e){
        return res.status(400).json(new ExpressError("One or more invalid input!", 400));
    }
})

module.exports = router;
