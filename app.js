"use strict";

const express = require('express');
const playersRoute = require('./routes/players');
const usersRoute = require('./routes/users');
const gamesRoute = require('./routes/games');
const authRoute = require('./routes/auth');

const app = express();

app.use(express.json());
app.use('', playersRoute);
app.use('/users', usersRoute);
app.use('/user', authRoute);
app.use('/games', gamesRoute);

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});


module.exports = app;

