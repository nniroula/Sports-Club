"use strict";

const express = require('express');

require("dotenv").config();
// const SECRET_KEY = "secrettocricketaecc";
const SECRET_KEY = process.env.secretkey || "secrettocricketaecc";


const PORT = +process.env.PORT || 3000;
// const PORT = 3000;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
      ? "aecc_test_db"
      : process.env.DATABASE_URL || "aecc_db";
}


//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

// console.log("PORT:", PORT.toString());

module.exports = {
    PORT,
    BCRYPT_WORK_FACTOR,
    SECRET_KEY,
    getDatabaseUri,
};
