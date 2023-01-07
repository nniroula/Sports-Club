const { Client } = require('pg');

let DB_URI;

if (process.env.NODE_ENV === "test"){
    DB_URI =  "aecc_test_db"
}else{
    DB_URI = process.env.DATABASE_URL;
}

// To make it run locally, call getDatabaseUri() from configurations.js file
/*
if (process.env.NODE_ENV === "production") {
    client = new Client({
      connectionString: getDatabaseUri(), // getDatabseUri() is defined in 
      ssl: {
        rejectUnauthorized: false,
      },
    });
  } else {
    client = new Client({
      connectionString: getDatabaseUri(),
    });
  }
*/

let db = new Client({
    connectionString: DB_URI,
    ssl: { rejectUnauthorized: false }
});

db.connect();

module.exports = db;



