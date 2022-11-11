"use strict";

const express = require('express');

/** Shared configurations for application, and is required at many places. */

// require("dotenv").config();
// require("colors");

// const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const SECRET_KEY = "secrettocricketaecc";


// const PORT = +process.env.PORT || 3000;
const PORT = 3000;

// Use dev database, testing database, or via env var, production database
// function getDatabaseUri() {
//   return (process.env.NODE_ENV === "test")
//       ? "jobly_test"
//       : process.env.DATABASE_URL || "jobly";
// }

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;


console.log("PORT:", PORT.toString());

module.exports = {
    PORT,
    BCRYPT_WORK_FACTOR,
    SECRET_KEY,
    // getDatabaseUri,
};
