const express = require("express");
var bodyParser = require("body-parser");
var routes1 = require("./routes/routes.js");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// **Steam sign-in process**
routes1(app);
// **Steam sign-in process**

var port = 4000;
var server = app.listen(port);
console.log("listening on port " + port);
