const { Client } = require('pg');

let DB_URI;

if(process.env.NODE_ENV === "test"){
    DB_URI = "postgresql:///aecc_test_db";
}else{
    DB_URI = "postgresql:///aecc_db"
}

let db = new Client({
    connectionString: DB_URI
});

// establish a connection to database
db.connect();

module.exports = db;

