const express = require("express");
const app = express();
const path = require("path");
const clientPath = path.resolve(__dirname + "/../client");
const bodyParser = require("body-parser");

// for cors error:
const cors = require("cors");
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use("/client", express.static(clientPath));

// Make the server
var server;
var port = process.env.PORT || process.env.NODE_PORT || 296;

// Router listeners
var router = require("./router.js");
router(app);

// Service listeners
var services = require("./services.js");
services(app);

// App listener
server = app.listen(port, function(err) {
    if (err) {
        throw err;
    }
    var timestamp = new Date(Date.now());
    console.log("Listening on port " + port + "\n" + timestamp.toUTCString());
});