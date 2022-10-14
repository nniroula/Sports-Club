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

    // POST Request
    static async createPlayer(fName, lName, email, birthDate, phoneNumber, emergencyContact, profilePictureUrl,
        playingRole, registeredDate){
            const result = await db.query(`INSERT INTO players(first_name, last_name, email, birth_date, 
                phone_number, emergency_contact, profile_picture_url,
                playing_role, registered_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, 
                first_name, last_name, email, birth_date, phone_number, emergency_contact, profile_picture_url,
                playing_role, registered_date`, [fName, lName, email, birthDate, phoneNumber, emergencyContact, 
                    profilePictureUrl, playingRole, registeredDate])
            
            return result.rows[0];
        }
}

module.exports = Player;


// 
// CREATE TABLE players (
//     // id SERIAL PRIMARY KEY,
//     first_name TEXT NOT NULL,
//     last_name TEXT NOT NULL,
//     email TEXT NOT NULL
//     CHECK (position('@' IN email) > 1),

//     birth_date TEXT NOT NULL,
//     phone_number TEXT NOT NULL,
//     emergency_contact TEXT NOT NULL,
//     profile_picture_url TEXT,
//     playing_role TEXT,
//     registered_date TEXT NOT NULL
//     -- exit_date TEXT NOT NULL DEFAULT NULL
// );