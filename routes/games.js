"use strict";

const express = require('express');
const jsonschema = require('jsonschema');
const gameSchema = require('../schemas/gameSchema');
const db = require('../db');  
const Game = require('../models/gameClass');
const { BadRequestError, ConflictError, NotFoundError } = require("../errors/expressErrors");

const router = new express.Router();

router.get('', async function(req, res, next){  // this is /games
    try{
        const results = await Game.getAllGames(); // getAllGames() returns a promise, so await it here
        return res.json(results);
    }catch(e){
        return next(e);
    }
})


router.get('/:id', async function(req, res, next){
    try{
        const result = await Game.getGameById(req.params.id);
        if(result === "not found"){
            return res.status(404).json(new NotFoundError(`Match with id of ${req.params.id} not found`, 404));
        }
        return res.json(result);
    }catch(e){
        return next(e);
    }
})


router.post('/', async function(req, res, next){
    try{
        const validatedInput = jsonschema.validate(req.body, gameSchema);
        if(!validatedInput.valid){
            const errs = validatedInput.errors.map(e => e.stack);
            return res.status(400).json(new BadRequestError(errs));  
        }
        const {game_date, venue, opposition_team, game_time} = req.body;
        const gameByDate = await Game.getGameByDate(game_date);
        const gameByTime = await Game.getGameByTime(game_time)

        if(gameByDate !== "not found" && gameByTime !== "not found"){
            return res.status(409).json(new ConflictError("Match is taken. Please verify it.", 409));
        }
        const game = await Game.createMatch(game_date, venue, opposition_team, game_time);
        return res.status(201).json(game);
    }catch(e){
        return next(e);
    }
})


router.put('/:id', async function(req, res, next){
    try{
        const inputValidation = jsonschema.validate(req.body, gameSchema);
        if(!inputValidation.valid){
            const errs = inputValidation.errors.map(e => e.stack);
            return res.status(400).json(new BadRequestError(errs)); 
        }
        const {game_date, venue, opposition_team, game_time} = req.body;
        const gameByDate = await Game.getGameByDate(game_date);
        const gameByTime = await Game.getGameByTime(game_time);

        if(gameByDate === "not found" || gameByTime === "not found"){
            const matchToBeUpdated = await Game.updateMatch(req.params.id, game_date, venue, opposition_team, game_time);
            return res.json(matchToBeUpdated);
        }else if(gameByDate.id !== Number(req.params.id) && gameByTime.id !== Number(req.params.id)){
            return res.status(409).json(new ConflictError("Match is taken! Try different date and time.", 409));
        }else{
                // both above find game, but games are different
            const matchToBeUpdated = await Game.updateMatch(req.params.id, game_date, venue, opposition_team, game_time);
            return res.json(matchToBeUpdated);
        }
    }catch(e){
        return next(e);
    }
})


router.delete('/:id', async function(req, res, next){
    try{
        const id = req.params.id;
        const result = await Game.deleteGame(id);
        res.json(result);
    }catch(e){
        return next(e);
    }
})


module.exports = router; 


