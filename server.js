"use strict";

const app = require("./app");
const { PORT } = require("./configs/configurations");

// app.listen(PORT, function () {
//     console.log(`Server started on http://localhost:${PORT}`);
// });

app.listen(process.env.PORT || PORT, function(){
    console.log(`Express server listening on port ${PORT}`);
  });