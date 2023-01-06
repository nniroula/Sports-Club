const { Client } = require('pg');

let DB_URI;

// if(process.env.NODE_ENV === "test"){
//     DB_URI = "postgresql:///aecc_test_db";
// }else{
//     DB_URI = "postgresql:///aecc_db"
// }
if (process.env.NODE_ENV === "test"){
    DB_URI =  "aecc_test_db"
}else{
    // DB_URI = process.env.DATABASE_URL || "aecc_db";
    DB_URI = process.env.DATABASE_URL;
}

let db = new Client({
    connectionString: DB_URI,
    ssl: { rejectUnauthorized: false }
});

// establish a connection to database
db.connect();

module.exports = db;

