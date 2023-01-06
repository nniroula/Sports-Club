const { Client } = require('pg');

let DB_URI;

// if(process.env.NODE_ENV === "test"){
//     DB_URI = "postgresql:///aecc_test_db";
// }else{
//     DB_URI = "postgresql:///aecc_db"
// }
postgres://qxmrhzhowsjcef:3bbdf03e872156edc986c1d28e2550f5ea32cea55e3affe15dbd358751cdf4d6@ec2-3-229-252-6.compute-1.amazonaws.com:5432/d9mp874l9q8pfa
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

