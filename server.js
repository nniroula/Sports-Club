"use strict";

const app = require("./app");
const { PORT } = require("./configs/configurations");

app.listen(PORT, function () {
    console.log(`Server started on http://localhost:${PORT}`);
});
