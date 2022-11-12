"use strict";

const app = require("./app");
const { PORT } = require("./configs/configurations");

// if(process.env.NODE_ENV !== 'production'){
//     require('dotenv').load();
// }

// const secrete_key = process.env.

// console.log()

app.listen(PORT, function () {
    console.log(`Server started on http://localhost:${PORT}`);
});
