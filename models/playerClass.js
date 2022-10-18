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
    // static async createPlayer(fName, lName, email, birthDate, phoneNumber, emergencyContact, profilePictureUrl,
    //                             playingRole, registeredDate){
    //         const result = await db.query(`INSERT INTO players(first_name, last_name, email, birth_date, 
    //             phone_number, emergency_contact, profile_picture_url,
    //             playing_role, registered_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, 
    //             first_name, last_name, email, birth_date, phone_number, emergency_contact, profile_picture_url,
    //             playing_role, registered_date`, [fName, lName, email, birthDate, phoneNumber, emergencyContact, 
    //                 profilePictureUrl, playingRole, registeredDate])
            
    //         return result.rows[0];
    // }


        // POST Request
    static async createPlayer(fName, lName, email, birthDate, phoneNumber, emergencyContact, profilePictureUrl,
        playingRole, registeredDate){
        const result = await db.query(`INSERT INTO players(first_name, 
                                            last_name, 
                                            email, 
                                            birth_date, 
                                            phone_number, 
                                            emergency_contact, 
                                            profile_picture_url,
                                            playing_role, 
                                            registered_date
                                        ) 
                                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
                                RETURNING id, 
                                    first_name, 
                                    last_name, 
                                    email, 
                                    birth_date, 
                                    phone_number, 
                                    emergency_contact, 
                                    profile_picture_url,
                                    playing_role, 
                                    registered_date`, 
                                [fName, lName, email, birthDate, phoneNumber, emergencyContact, 
                                    profilePictureUrl, playingRole, registeredDate
                                ])
        return result.rows[0];
    }

    // define an update method
    // you need an id of the player to be updated
    // NOTE updating with an invalid id throws wrong erorr in postman
    static async updatePlayer(id, fName, lName, email, birthDate, phoneNumber, emergencyContact, 
                        profilePictureUrl, playingRole, registeredDate){
        const result = await db.query(`UPDATE players SET 
                                            first_name = $1, 
                                            last_name = $2, 
                                            email = $3, 
                                            birth_date = $4, 
                                            phone_number = $5, 
                                            emergency_contact = $6, 
                                            profile_picture_url = $7,
                                            playing_role = $8, 
                                            registered_date = $9 WHERE id = $10 
                                        RETURNING id, 
                                            first_name, 
                                            last_name, 
                                            email, 
                                            birth_date, 
                                            phone_number, 
                                            emergency_contact, 
                                            profile_picture_url,
                                            playing_role, 
                                            registered_date`,  
                                        [fName, lName, email, birthDate, 
                                                phoneNumber, emergencyContact, profilePictureUrl, playingRole, 
                                                registeredDate, id]
                                    );
        // debugger;
        // throw an error if result.rows.lenght === 0
        if(result.rows.length === 0){
            throw new ExpressError(`player with id of ${id} not found`, 404)
            // return new ExpressError(`player with id of ${id} not found`, 404)
        }
        // debugger;
        return result.rows[0];
    }

    // delete a player by its id
    static async deletePlayer(id){
        // inquiry the database to get the player by the id
        const player = await db.query(`SELECT * FROM players WHERE id=${id}`)
        // const player = await Player.getPlayerById(id);
        if(player.rows.length === 0){
            // throw new ExpressError(`player with id of ${id} is not found`, 404 );
            return new ExpressError(`player with id of ${id} is not found`, 404 );
        }

        // const result = db.query('DELETE FROM players WHERE id = $1', [req.params.id]);
        // const result = db.query('DELETE FROM players WHERE id = $1', [id]);
        db.query('DELETE FROM players WHERE id = $1', [id]);
        // return ({message: "Successfully deleted a user"});
        return ({message: `Successfully deleted a player with id of ${id}.`});

        // return player;
        // return ;
    } 
}

module.exports = Player;

