const db = require('../db');
const { ExpressError } = require('../errors/expressErrors');

/* 
    No constructor. So, class cannot be instantiated. So static as a modifier to the method make the method a class
    method, and thus, allows to call that method on a class without instantiating the class.
    Game class is a model class to create, update, delete, and retrieve a game
*/

class Game{
    static async getAllGames(){
        const result = await db.query(`SELECT * FROM games`);
        return result.rows;
    }

    static async getGameById(id){
        const result = await db.query(`SELECT * FROM games WHERE id=$1`, [id]);
        
        if(result.rows.length === 0){
            return "not found";
        }
        return result.rows[0];
    }

    static async getGameByDate(gameDate){
        const result = await db.query(`SELECT * FROM games WHERE game_date=$1`, [gameDate]);
        if(result.rows.length === 0){
            return "not found";
        }
        return result.rows[0];
    }

    static async getGameByTime(gameTime){
        const result = await db.query(`SELECT * FROM games WHERE game_time=$1`, [gameTime]);
        if(result.rows.length === 0){
            return "not found";
        }
        return result.rows[0];
    }

    static async getGameByOppositionTeam(opposition_team){
        const oppositionTeam = await db.query(`SELECT * FROM games WHERE oppostion_team = $1`, [opposition_team]);
        if(oppositionTeam.rows.length > 0){
            return oppositionTeam.rows[0];
        }
        return "Not Found";
    }

    static async createMatch(gameDate, venue, opposition_team, time){
        const result = await db.query(`INSERT INTO games(game_date, venue, opposition_team, game_time) 
                                VALUES($1, $2, $3, $4) 
                                RETURNING id, game_date, venue, opposition_team, game_time`,
                                [gameDate, venue, opposition_team, time])
        return result.rows[0];
    }

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
        if(result.rows.length === 0){
            throw new ExpressError(`Match with id of ${id} not found`, 404);
        }
        return result.rows[0];
    }

    static async deleteGame(id){
        const match = await db.query(`SELECT * FROM games WHERE id=${id}`)
        if(match.rows.length === 0){
            return new ExpressError(`Match with id of ${id} is not found`, 404 );
        }
        db.query('DELETE FROM games WHERE id = $1', [id]);
        return ({message: `Successfully deleted a game with id of ${id}.`});
    } 
}

module.exports = Game;

