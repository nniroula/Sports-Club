const db = require('../db');
const { ExpressError } = require('../errors/expressErrors');


/*
    No constructor. So, class cannot be instantiated. So static as a modifier to the method make the method a class
    method, and thus, allows to call that method on a class without instantiating the class.
    Player class is a model class used to create, update, delete, and retrieve player(s)
*/

class Player{
    static async getAllPlayers(){
        const result = await db.query(`SELECT * FROM players`);
        return result.rows;
    }

    static async getPlayerById(id){
        const result = await db.query(`SELECT * FROM players WHERE id=$1`, [id]);
        if(result.rows.length === 0){
            return "not found";
        }
        return result.rows[0];
    }

    static async getPlayerByEmail(email){
        const existingPlayerWithEmail = await db.query(`SELECT * FROM players WHERE email = $1`, [email]);
        if(existingPlayerWithEmail.rows.length > 0){
            return existingPlayerWithEmail.rows[0];
        }
        return "Not Found";
    }

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
                                [fName, lName, email, birthDate, phoneNumber, emergencyContact, profilePictureUrl, 
                                    playingRole, registeredDate
                                ])
        return result.rows[0];
    }

    static async updatePlayer(id, fName, lName, email, birthDate, phoneNumber, emergencyContact, profilePictureUrl, 
        playingRole, registeredDate){
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
                                        [fName, lName, email, birthDate, phoneNumber, emergencyContact, 
                                            profilePictureUrl, playingRole, registeredDate, id
                                        ]
                                    );
        if(result.rows.length === 0){
            throw new ExpressError(`player with id of ${id} not found`, 404)
        }
        return result.rows[0];
    }

    static async deletePlayer(id){
        const player = await db.query(`SELECT * FROM players WHERE id=${id}`)
        if(player.rows.length === 0){
            return new ExpressError(`player with id of ${id} is not found`, 404 );
        }
        db.query('DELETE FROM players WHERE id = $1', [id]);
        return ({message: `Successfully deleted a player with id of ${id}.`});
    } 
}

module.exports = Player;

