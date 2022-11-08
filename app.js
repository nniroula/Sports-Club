"use strict";

const express = require('express');
// import routes
const playersRoute = require('./routes/players');
const usersRoute = require('./routes/users');

const gamesRoute = require('./routes/games');
// import error class
const { NotFoundError, ExpressError } = require("./errors/expressErrors");

// import the middleware routes
const middlewareRoute = require('./middleware/auth');
const authRoute = require('./routes/auth');

const app = express();

// use the players route
// app.use('/', playersRoute);

app.use(express.json()); // parse request bodies for json
app.use('', playersRoute);
// app.use(ExpressError)
app.use('/users', usersRoute);
// use middleware rotue
// app.use('/user', middlewareRoute);
app.use('/user', authRoute);
app.use('/games', gamesRoute);




/** Handle 404 errors -- this matches everything */
// app.use(function (req, res, next) {
//     return next(new NotFoundError());
// });

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

// app.listen(3000, function(){
//     console.log("Server started on the port 3000");
// })


module.exports = app;


// 
/*

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const companiesRoutes = require("./routes/companies");
const usersRoutes = require("./routes/users");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/companies", companiesRoutes); // this is only "/" in companies.js file
app.use("/users", usersRoutes);




module.exports = app;
*/
