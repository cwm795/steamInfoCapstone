'use strict';

var express = require("express");

var app = express();

app.get("/", function(httpRequest, httpResponse) {
  httpResponse.send("Hello, World!");
});
