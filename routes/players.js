"use strict";

const { json } = require('express');
const express = require('express');
const jsonschema = require('jsonschema');
const playerSchema = require('../schemas/playerSchema');
const db = require('../db');  
const Player = require('../models/playerClass');
const { BadRequestError, ConflictError, NotFoundError } = require("../errors/expressErrors");

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


// update the player
router.put('/players/:id', async function(req, res, next){
    try{
        // validate with json schema for players
        const inputValidation = jsonschema.validate(req.body, playerSchema);
        if(!inputValidation.valid){
            const errs = inputValidation.errors.map(e => e.stack);
            return res.status(400).json(new BadRequestError(errs)); 
        }
        // grab the input from the request body by destructuring the request body
        const {first_name, last_name, email, birth_date, 
            phone_number, emergency_contact, profile_picture_url,
            playing_role, registered_date} = req.body;

        // check if email belongs to a different user
        const existingPlayerWithEmail = await Player.getPlayerByEmail(email);
        const idOfExistingPlayer = existingPlayerWithEmail['id'];
        if(idOfExistingPlayer !== req.params.id){
            return res.status(409).json(new ConflictError("Email is taken! Try different one", 409));
        }

        // to update, get the player id from  the url param. update method is defined in Player class
        const playerToBeUpdated = await Player.updatePlayer(req.params.id, first_name, last_name, email, birth_date, 
            phone_number, emergency_contact, profile_picture_url,
            playing_role, registered_date);
        
        // debugger;
        return res.json(playerToBeUpdated);

    }catch(e){
        return next(e);
    }
})


// delete a player, later on archieve it
router.delete('/players/:id', async function(req, res, next){
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


