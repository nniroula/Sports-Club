

const db = require('../db');
const errors = require('../errors/expressErrors');
const { ExpressError, NotFoundError, ConflictError } = require('../errors/expressErrors');
// import bcrypt
const bcrypt = require('bcrypt'); // create work factor of 12 in config file
const { BCRYPT_WORK_FACTOR } = require('../configs/configurations');

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
        const hashed_password = await bcrypt.hash(pass_word, BCRYPT_WORK_FACTOR);

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
                                [fName, lName, user_name, hashed_password, email_id, phoneNumber, isAdmin, registeredDate])

        return result.rows[0];
    }


    // define an update method
    // you need an id of the player to be updated
    // NOTE updating with an invalid id throws wrong erorr in postman
    // first_name, last_name, username, password, email, phone_number, is_admin, start_date
    
    static async updateUser(id, fName, lName, user_name, pass_word, email_id, phoneNumber, isAdmin, registeredDate){
        const result = await db.query(`UPDATE users SET 
                                            first_name = $1, 
                                            last_name = $2, 
                                            username = $3, 
                                            password = $4,
                                            email= $5, 
                                            phone_number = $6, 
                                            is_admin = $7, 
                                            start_date = $8 WHERE id = $9 
                                        RETURNING id, 
                                            first_name, 
                                            last_name,
                                            username, 
                                            email, 
                                            phone_number, 
                                            is_admin,  
                                            start_date`,  
                                        [fName, lName, user_name, pass_word, email_id, phoneNumber, isAdmin, registeredDate, id]
                                    );
        if(result.rows.length === 0){
            throw new ExpressError(`player with id of ${id} not found`, 404)
            // return new ExpressError(`player with id of ${id} not found`, 404)
        }
        return result.rows[0];
    }
    

    /*
    // update without updating password, after update request ask to enter password.
    static async updateUser(id, fName, lName, user_name, email_id, phoneNumber, isAdmin, registeredDate){
        const result = await db.query(`UPDATE users SET 
                                            first_name = $1, 
                                            last_name = $2, 
                                            username = $3, 
                                    
                                            email= $4, 
                                            phone_number = $5, 
                                            is_admin = $6, 
                                            start_date = $7 WHERE id = $8 
                                        RETURNING id, 
                                            first_name, 
                                            last_name,
                                            username, 
                                            email, 
                                            phone_number, 
                                            is_admin,  
                                            start_date`,  
                                        [fName, lName, user_name, email_id, phoneNumber, isAdmin, registeredDate, id]
                                    );
        if(result.rows.length === 0){
            throw new ExpressError(`player with id of ${id} not found`, 404)
            // return new ExpressError(`player with id of ${id} not found`, 404)
        }
        return result.rows[0];
    }

    */

    // delete a user by its id
    static async deleteUser(id){
        // inquiry the database to get the player by the id
        const user = await db.query(`SELECT * FROM users WHERE id=${id}`)
        if(user.rows.length === 0){
            // throw new ExpressError(`player with id of ${id} is not found`, 404 );
            return new ExpressError(`User with id of ${id} is not found`, 404 );
        }
        db.query('DELETE FROM users WHERE id = $1', [id]);
        return ({message: `Successfully deleted a user with id of ${id}.`});
    } 

    // get the password from the database with the given username
    // update the password with patch function, use user id
    // static async updatePassword(username){
    //     const user = await db.query(`SELECT * FROM users WHERE username=$1`, [username])
    // }
}

module.exports = User;

