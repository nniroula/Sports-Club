const db = require('../db');
const { ExpressError } = require('../errors/expressErrors');
const bcrypt = require('bcrypt');
const { BCRYPT_WORK_FACTOR } = require('../configs/configurations');

class User{
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

    static async getAdminByUsername(username){
        const admin = await db.query(`SELECT * FROM users WHERE is_admin=$1 AND username=$2`, ['true', username]);
        if(admin.rows.length > 0){
            return admin.rows[0];
        }
        return "Not Found";
    }

    static async getAdminByEmail(email){ 
        const admin = await db.query(`SELECT * FROM users WHERE is_admin=$1 AND email=$2`, ['true', email]);
        if(admin.rows.length > 0){
            return admin.rows[0];
        }
        return "Not Found";
    }

    static async getUserById(id){
        const result = await db.query(`SELECT * FROM users WHERE id=$1`, [id]);
        if(result.rows.length === 0){
            return "not found";
        }
        return result.rows[0];
    }

    static async getUserByEmail(email){
        const existingUserWithEmail = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if(existingUserWithEmail.rows.length > 0){
            return existingUserWithEmail.rows[0];
        }
        return "Not Found";
    }

    static async getUserByUsername(username){
        const existingUserWithUsername = await db.query(`SELECT * FROM users WHERE username = $1`, [username]);
        if(existingUserWithUsername.rows.length > 0){
            return existingUserWithUsername.rows[0];
        }
        return "Not Found";
    }

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
        }
        return result.rows[0];
    }
    
    static async deleteUser(id){
        const user = await db.query(`SELECT * FROM users WHERE id=${id}`)
        if(user.rows.length === 0){
            return new ExpressError(`User with id of ${id} is not found`, 404 );
        }
        db.query('DELETE FROM users WHERE id = $1', [id]);
        return ({message: `Successfully deleted a user with id of ${id}.`});
    } 
}

module.exports = User;

