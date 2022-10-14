const db = require('../db');
const errors = require('../errors/expressErrors');
const { ExpressError, NotFoundError } = require('../errors/expressErrors');

/* NOTE:
    We do not have constructor and we are not going to instantiate the class. So static as a modifier to the method
    in a class, so that you can call that method on a class without instantiating that class.
*/

class Player{
    // make the methods only class methods(which means use static key word)
    static async getAllPlayers(){
        // extract the sql statemnt in the players route and use it here
        /* Return not *, but only what is needed, select id, firstName, lastName, email, dateOfBirth*/
        const result = await db.query(`SELECT * FROM players`);
        return result.rows;
    }

    // make a class method that returns one player
    static async getPlayerById(id){
        const result = await db.query(`SELECT * FROM players WHERE id=$1`, [id]);
        
        // handle error for invalid id, if reslult.rows.lenght === 0, error
        if(result.rows.length === 0){
            // create custom error class and call it here

            throw new ExpressError(`Player with id of ${id} not found.`, 404);
            // return new ExpressError(`Player with id of ${id} not found.`, 404);
            // throw new NotFoundError('play with the id not found');
        }
        return result.rows[0];
    }
}

module.exports = Player;