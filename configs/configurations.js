"use strict";

const express = require('express');

require("dotenv").config();
const SECRET_PASS = process.env.SECRET_KEY || "secrettocricketaecc";
const PORT = process.env.PORT || 3000;

// To run locally, create getDatbaseUri and call it in db.js file
/*
Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
      ? "aecc_test_db"
      : process.env.DATABASE_URL || "aecc_db";
}
*/

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;
// console.log("PORT:", PORT.toString());

module.exports = {
    PORT,
    BCRYPT_WORK_FACTOR,
    SECRET_PASS
    // getDatabaseUri,
};
