

const db = require('../db');
const errors = require('../errors/expressErrors');
const { ExpressError, NotFoundError, ConflictError } = require('../errors/expressErrors');

/* NOTE:
    We do not have constructor and we are not going to instantiate the class. So static as a modifier to the method
    in a class, so that you can call that method on a class without instantiating that class.
*/

class User{
    // make the methods only class methods(which means use static key word)
    // get all users including admin
    static async getAllUsers(){
        const result = await db.query(`SELECT id, first_name, last_name, username, email, phone_number,
                                is_admin, start_date FROM users`);
        return result.rows;
    }


    static async getAllAdmins(){
        const result = await db.query(`SELECT id, first_name, last_name, username, email, phone_number,
                                        is_admin, start_date FROM users WHERE is_admin=true`);
        return result.rows;
    }

    // make a class method that returns one user
    static async getUserById(id){
        const result = await db.query(`SELECT * FROM users WHERE id=$1`, [id]);
        
        if(result.rows.length === 0){
            return "not found";
        }
        return result.rows[0];
    }

    // get a user by email
    static async getUserByEmail(email){
        const existingUserWithEmail = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if(existingUserWithEmail.rows.length > 0){
            return existingUserWithEmail.rows[0];
        }
        return "Not Found";
    }

    // get a user by username
    static async getUserByUsername(username){
        const existingUserWithUsername = await db.query(`SELECT * FROM users WHERE username = $1`, [username]);
        if(existingUserWithUsername.rows.length > 0){
            return existingUserWithUsername.rows[0];
        }
        return "Not Found";
    }

    // POST Request
    static async createUser(fName, lName, user_name, pass_word, email_id, phoneNumber, isAdmin, registeredDate){

        const result = await db.query(`INSERT INTO users(first_name, 
                                            last_name, 
                                            username,
                                            password, 
                                            email, 
                                            phone_number, 
                                            is_admin,
                                            start_date
                                        ) 
                                VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
                                RETURNING id, 
                                    first_name, 
                                    last_name, 
                                    username,
                                    email, 
                                    phone_number, 
                                    is_admin,
                                    start_date`, 
                                [fName, lName, user_name, pass_word, email_id, phoneNumber, isAdmin, registeredDate])
        return result.rows[0];
    }



    // id SERIAL PRIMARY KEY,
    // first_name TEXT NOT NULL,
    // last_name TEXT NOT NULL,
    // username VARCHAR(25) NOT NULL,
    // password TEXT NOT NULL,
    // email TEXT NOT NULL CHECK (position('@' IN email) > 1),
    // phone_number TEXT UNIQUE NOT NULL,
    // is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    // -- start_date TEXT NOT NULL
    // start_date TEXT 



    // define an update method
    // you need an id of the player to be updated
    // NOTE updating with an invalid id throws wrong erorr in postman
    // static async updatePlayer(id, fName, lName, email, birthDate, phoneNumber, emergencyContact, 
    //                     profilePictureUrl, playingRole, registeredDate){
    //     const result = await db.query(`UPDATE players SET 
    //                                         first_name = $1, 
    //                                         last_name = $2, 
    //                                         email = $3, 
    //                                         birth_date = $4, 
    //                                         phone_number = $5, 
    //                                         emergency_contact = $6, 
    //                                         profile_picture_url = $7,
    //                                         playing_role = $8, 
    //                                         registered_date = $9 WHERE id = $10 
    //                                     RETURNING id, 
    //                                         first_name, 
    //                                         last_name, 
    //                                         email, 
    //                                         birth_date, 
    //                                         phone_number, 
    //                                         emergency_contact, 
    //                                         profile_picture_url,
    //                                         playing_role, 
    //                                         registered_date`,  
    //                                     [fName, lName, email, birthDate, 
    //                                             phoneNumber, emergencyContact, profilePictureUrl, playingRole, 
    //                                             registeredDate, id]
    //                                 );
    //     // debugger;
    //     // throw an error if result.rows.lenght === 0
    //     if(result.rows.length === 0){
    //         throw new ExpressError(`player with id of ${id} not found`, 404)
    //         // return new ExpressError(`player with id of ${id} not found`, 404)
    //     }
    //     // debugger;
    //     return result.rows[0];
    // }

    // delete a player by its id
    // static async deletePlayer(id){
    //     // inquiry the database to get the player by the id
    //     const player = await db.query(`SELECT * FROM players WHERE id=${id}`)
    //     if(player.rows.length === 0){
    //         // throw new ExpressError(`player with id of ${id} is not found`, 404 );
    //         return new ExpressError(`player with id of ${id} is not found`, 404 );
    //     }
    //     db.query('DELETE FROM players WHERE id = $1', [id]);
    //     return ({message: `Successfully deleted a player with id of ${id}.`});
    // } 
}

module.exports = User;

