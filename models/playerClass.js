const db = require('../db');

class Player{
    // make the methods only class methods(which means use static key word)
    static async getAllPlayers(){
        // extract the sql statemnt in the players route and use it here
        const result = await db.query(`SELECT * FROM players`);
        // let players = result.rows;
        // return players;
        return result.rows;
    }

    // make a class method that returns one player
}

module.exports = Player;