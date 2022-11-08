const db = require('../db');
const errors = require('../errors/expressErrors');
const { ExpressError, NotFoundError, ConflictError } = require('../errors/expressErrors');

/* NOTE:
    We do not have constructor and we are not going to instantiate the class. So static as a modifier to the method
    in a class, so that you can call that method on a class without instantiating that class.
*/

class Game{
    // make the methods only class methods(which means use static key word)
    static async getAllGames(){
        const result = await db.query(`SELECT * FROM games`);
        return result.rows;
    }

    // make a class method that returns one player
    static async getGameById(id){
        const result = await db.query(`SELECT * FROM games WHERE id=$1`, [id]);
        
        if(result.rows.length === 0){
            return "not found";
        }
        return result.rows[0];
    }

    // getGameByDate
    static async getGameByDate(gameDate){
        const result = await db.query(`SELECT * FROM games WHERE game_date=$1`, [gameDate]);
        if(result.rows.length === 0){
            return "not found";
        }
        return result.rows[0];
    }

    //   const gameByTime = await Game.getGameByTime(game_time)
    static async getGameByTime(gameTime){
        const result = await db.query(`SELECT * FROM games WHERE game_time=$1`, [gameTime]);
        if(result.rows.length === 0){
            return "not found";
        }
        return result.rows[0];
    }

    // get a player by email
    static async getGameByOppositionTeam(opposition_team){
        const oppositionTeam = await db.query(`SELECT * FROM games WHERE oppostion_team = $1`, [opposition_team]);
        if(oppositionTeam.rows.length > 0){
            return oppositionTeam.rows[0];
        }
        return "Not Found";
    }

    // POST Request
    static async createMatch(gameDate, venue, opposition_team, time){
        const result = await db.query(`INSERT INTO games(game_date, venue, opposition_team, game_time) 
                                VALUES($1, $2, $3, $4) 
                                RETURNING id, game_date, venue, opposition_team, game_time`,
                                [gameDate, venue, opposition_team, time])
        return result.rows[0];
    }

    // define an update method
    // you need an id of the player to be updated
    // NOTE updating with an invalid id throws wrong erorr in postman
    static async updateMatch(id, matchDate, place, oppositeTeam, gameTime){
        console.log("Inside update match function");
        const result = await db.query(`UPDATE games SET 
                                            game_date = $1, 
                                            venue = $2, 
                                            opposition_team = $3, 
                                            game_time = $4 
                                            WHERE id = $5 
                                        RETURNING id, game_date, venue, opposition_team, game_time`, 
                                        [matchDate, place, oppositeTeam, gameTime, id]
                                    );
        // debugger;
        // throw an error if result.rows.lenght === 0
        console.log("Run it HERE ***************** ");
        if(result.rows.length === 0){
            throw new ExpressError(`Match with id of ${id} not found`, 404)
            // return new ExpressError(`player with id of ${id} not found`, 404)
        }
        // debugger;
        return result.rows[0];
    }

    // delete a player by its id
    static async deleteGame(id){
        // inquiry the database to get the player by the id
        const match = await db.query(`SELECT * FROM games WHERE id=${id}`)
        if(match.rows.length === 0){
            // throw new ExpressError(`player with id of ${id} is not found`, 404 );
            return new ExpressError(`Match with id of ${id} is not found`, 404 );
        }
        db.query('DELETE FROM games WHERE id = $1', [id]);
        return ({message: `Successfully deleted a game with id of ${id}.`});
    } 
}

module.exports = Game;

