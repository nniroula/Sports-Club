// email validation, incomplete /(^[a-zA-Z]+|^[a-zA-Z]+[0-9]+)[@][a-zA-Z]+[.][a-zA-Z]+$/.test('q11@d.ai')


"use strict";

const { json } = require('express');
const express = require('express');
const jsonschema = require('jsonschema');
const userSchema = require('../schemas/userSchema');
const db = require('../db');  
const User = require('../models/userClass');
const { BadRequestError, ConflictError, NotFoundError } = require("../errors/expressErrors");

const router = new express.Router();


// get all users
// router.get('/users', async function(req, res, next){
router.get('/', async function(req, res, next){
    try{
        const results = await User.getAllUsers(); // getAllPlayer() returns a promise, so await it here
        return res.json(results);
    }catch(e){
        return next(e);
    }
})

// all admins
router.get('/admins', async function(req, res, next){
    try{
        const results = await User.getAllAdmins(); // getAllPlayer() returns a promise, so await it here
        return res.json(results);
    }catch(e){
        return next(e);
    }
})


// get a single user becomes /users/:id
router.get('/:id', async function(req, res, next){
    // invalid id should throw error, it does not do that. handle it in getPlayerById method
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
        // verify if a player already exist with a given email
        const existingUserWithInputEmail = await User.getUserByEmail(email);
        const existingUserWithInputUsername = await User.getUserByUsername(username);
        // if(existingPlayerWithInputEmail === true){
        if(existingUserWithInputEmail !== "Not Found"){
            return res.status(409).json(new ConflictError("Email is taken. Please use a different one.", 409));
        }

        if(existingUserWithInputUsername !== "Not Found"){
            return res.status(409).json(new ConflictError("Username is taken. Please use a different one.", 409));
        }

        // createUser(fName, lName, user_name, pass_word, email, phoneNumber, registeredDate)
        const user = await User.createUser(first_name, last_name, username, password, email, phone_number, is_admin, start_date);
        // const user = User.createUser(req.body);
        return res.status(201).json(user);
    }catch(e){
        return next(e);
    }
})


// update the player
// router.put('/players/:id', async function(req, res, next){
//     try{
//         // validate with json schema for players
//         const inputValidation = jsonschema.validate(req.body, playerSchema);
//         if(!inputValidation.valid){
//             const errs = inputValidation.errors.map(e => e.stack);
//             return res.status(400).json(new BadRequestError(errs)); 
//         }
//         // grab the input from the request body by destructuring the request body
//         const {first_name, last_name, email, birth_date, 
//             phone_number, emergency_contact, profile_picture_url,
//             playing_role, registered_date} = req.body;

//         // check if email belongs to a different user
//         const existingPlayerWithEmail = await Player.getPlayerByEmail(email);
//         const idOfExistingPlayer = existingPlayerWithEmail['id'];
//         if(idOfExistingPlayer !== req.params.id){
//             return res.status(409).json(new ConflictError("Email is taken! Try different one", 409));
//         }

//         // to update, get the player id from  the url param. update method is defined in Player class
//         const playerToBeUpdated = await Player.updatePlayer(req.params.id, first_name, last_name, email, birth_date, 
//             phone_number, emergency_contact, profile_picture_url,
//             playing_role, registered_date);
        
//         // debugger;
//         return res.json(playerToBeUpdated);

//     }catch(e){
//         return next(e);
//     }
// })


// delete a player, later on archieve it
// router.delete('/players/:id', async function(req, res, next){
//     try{
//         // destructure the request params, and get the id
//         const id = req.params.id;
//         const result = await Player.deletePlayer(id);
//         res.json(result);
//     }catch(e){
//         return next(e);
//     }
// })

module.exports = router;



