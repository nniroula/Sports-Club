"use strict";

const { json } = require('express');
const express = require('express');
const jsonschema = require('jsonschema');
const playerSchema = require('../schemas/playerSchema');
const db = require('../db');  
const Player = require('../models/playerClass');
const { BadRequestError, ConflictError, NotFoundError } = require("../errors/expressErrors");

const {authenticateJWT, ensureAdmin, ensureLoggedIn} = require('../middleware/auth')

const router = new express.Router();

// HOME Route
router.get('/', function(req, res, next){
    console.log("This the home route for the app.");
    return res.send({
        "name": "Aurora Everest Cricket Club",
        "Estd": "July 2020"
    });
})


router.get('/players', async function(req, res, next){
    try{
        const results = await Player.getAllPlayers(); // getAllPlayer() returns a promise, so await it here
        return res.json(results);
    }catch(e){
        return next(e);
    }
})


// get a single player
router.get('/players/:id', async function(req, res, next){
    // invalid id should throw error, it does not do that. handle it in getPlayerById method
    try{
        const result = await Player.getPlayerById(req.params.id);
        if(result === "not found"){
            return res.status(404).json(new NotFoundError(`player with id of ${req.params.id} not found`, 404));
        }
        return res.json(result);
    }catch(e){
        return next(e);
    }
})


// post request // NEW Version with jsonschema
/*
router.post('/players', async function(req, res, next){
    try{
        const validatedInput = jsonschema.validate(req.body, playerSchema);
        if(!validatedInput.valid){
            const errs = validatedInput.errors.map(e => e.stack);
            return res.status(400).json(new BadRequestError(errs));  
        }
        const {first_name, last_name, email, birth_date, phone_number, emergency_contact, profile_picture_url,
                playing_role, registered_date} = req.body;
        // verify if a player already exist with a given email
        const existingPlayerWithInputEmail = await Player.getPlayerByEmail(email);
        // if(existingPlayerWithInputEmail === true){
        if(existingPlayerWithInputEmail !== "Not Found"){
            return res.status(409).json(new ConflictError("Email is taken. Please use a different email.", 409));
        }
        const player = await Player.createPlayer(first_name, last_name, email, birth_date, phone_number, 
                                    emergency_contact, profile_picture_url, playing_role, registered_date);
        // const player = Player.createPlayer(req.body);
        return res.status(201).json(player);
    }catch(e){
        return next(e);
    }
})
*/

/*
router.get('/admin', authenticateJWT, ensureAdmin, (req, res, next) => {
    try{
        console.log("HIT this admin");
        return res.json({msg: `You have admin rights`});
    }catch(e){
        return next(new ExpressError("You must be admin", 401));

    }

})
*/

// router.post('/players', async function(req, res, next){
router.post('/players', authenticateJWT, ensureLoggedIn, ensureAdmin, async function(req, res, next){
// router.post('/players', authenticateJWT, ensureAdmin, async function(req, res, next){
    try{
        const validatedInput = jsonschema.validate(req.body, playerSchema);
        if(!validatedInput.valid){
            const errs = validatedInput.errors.map(e => e.stack);
            return res.status(400).json(new BadRequestError(errs));  
        }
        const {first_name, last_name, email, birth_date, phone_number, emergency_contact, profile_picture_url,
                playing_role, registered_date} = req.body;
        // verify if a player already exist with a given email
        const existingPlayerWithInputEmail = await Player.getPlayerByEmail(email);
        // if(existingPlayerWithInputEmail === true){
        if(existingPlayerWithInputEmail !== "Not Found"){
            return res.status(409).json(new ConflictError("Email is taken. Please use a different email.", 409));
        }
        const player = await Player.createPlayer(first_name, last_name, email, birth_date, phone_number, 
                                    emergency_contact, profile_picture_url, playing_role, registered_date);
        // const player = Player.createPlayer(req.body);
        return res.status(201).json(player);
    }catch(e){
        // return next(e);
        return next(new ExpressError("You must be admin", 401));
    }
})

// update the player authenticateJWT, ensureLoggedIn, ensureAdmin,
// router.put('/players/:id', async function(req, res, next){
router.put('/players/:id', authenticateJWT, ensureLoggedIn, ensureAdmin, async function(req, res, next){
    try{
        // validate with json schema for players
        const inputValidation = jsonschema.validate(req.body, playerSchema);
        if(!inputValidation.valid){
            const errs = inputValidation.errors.map(e => e.stack);
            return res.status(400).json(new BadRequestError(errs)); 
        }
        // grab the input from the request body by destructuring the request body
        const {first_name, last_name, email, birth_date, phone_number, emergency_contact, profile_picture_url,
            playing_role, registered_date} = req.body;

        // check if email belongs to a different user  "Not Found";
        const existingPlayerWithEmail = await Player.getPlayerByEmail(email); // if found nothing, retunrs undefined
        const idOfExistingPlayer = existingPlayerWithEmail['id'];

        if(existingPlayerWithEmail !== "Not Found"){ // it returns some player
            if(idOfExistingPlayer !== Number(req.params.id)){
                return res.status(409).json(new ConflictError("Email is taken! Try different one", 409));
            }
        }

        const playerToBeUpdated = await Player.updatePlayer(req.params.id, first_name, last_name, email, birth_date, 
            phone_number, emergency_contact, profile_picture_url, playing_role, registered_date);
        
        return res.json(playerToBeUpdated);

    }catch(e){
        return next(e);
    }
})


// delete a player, later on archieve it
// router.post('/players', authenticateJWT, ensureLoggedIn, ensureAdmin, async function(req, res, next){
// router.delete('/players/:id', async function(req, res, next){
router.delete('/players/:id', authenticateJWT, ensureLoggedIn, ensureAdmin, async function(req, res, next){
    try{
        // destructure the request params, and get the id
        const id = req.params.id;
        const result = await Player.deletePlayer(id);
        res.json(result);
    }catch(e){
        return next(e);
    }
})

module.exports = router;


