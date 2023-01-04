"use strict";

const express = require('express');
const jsonschema = require('jsonschema');
const playerSchema = require('../schemas/playerSchema');
const Player = require('../models/playerClass');
const { BadRequestError, ConflictError, NotFoundError, ExpressError } = require("../errors/expressErrors");
const {authenticateJWT, ensureAdmin, ensureLoggedIn} = require('../middleware/auth')

const router = new express.Router();

router.get('/players', async function(req, res, next){
    try{
        const results = await Player.getAllPlayers(); 
        return res.json(results);
    }catch(e){
        return next(e);
    }
})

router.get('/players/:id', async function(req, res, next){
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


router.post('/players', authenticateJWT, ensureLoggedIn, ensureAdmin, async function(req, res, next){
    try{
        const validatedInput = jsonschema.validate(req.body, playerSchema);
        if(!validatedInput.valid){
            const errs = validatedInput.errors.map(e => e.stack);
            return res.status(400).json(new BadRequestError(errs));  
        }
        const {first_name, last_name, email, birth_date, phone_number, emergency_contact, profile_picture_url,
                playing_role, registered_date} = req.body;
        const existingPlayerWithInputEmail = await Player.getPlayerByEmail(email);
    
        if(existingPlayerWithInputEmail !== "Not Found"){
            return res.status(409).json(new ConflictError("Email is taken. Please use a different email.", 409));
        }
        const player = await Player.createPlayer(first_name, last_name, email, birth_date, phone_number, 
                        emergency_contact, profile_picture_url, playing_role, registered_date);
        return res.status(201).json(player);
    }catch(e){
        return next(e);
    }
})

router.put('/players/:id', authenticateJWT, ensureLoggedIn, ensureAdmin, async function(req, res, next){
    try{
        const inputValidation = jsonschema.validate(req.body, playerSchema);
        if(!inputValidation.valid){
            const errs = inputValidation.errors.map(e => e.stack);
            return res.status(400).json(new BadRequestError(errs)); 
        }
        const {first_name, last_name, email, birth_date, phone_number, emergency_contact, profile_picture_url,
            playing_role, registered_date} = req.body;
        const existingPlayerWithEmail = await Player.getPlayerByEmail(email);
        const idOfExistingPlayer = existingPlayerWithEmail['id'];

        if(existingPlayerWithEmail !== "Not Found"){
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

router.delete('/players/:id', authenticateJWT, ensureLoggedIn, ensureAdmin, async function(req, res, next){
    try{
        const id = req.params.id;
        const result = await Player.deletePlayer(id);
        res.json(result);
    }catch(e){
        return next(e);
    }
})

module.exports = router;


