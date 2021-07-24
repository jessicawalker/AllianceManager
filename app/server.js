const express = require('express');
const app = express();
//const router = express.Router();
const mongoose = require('mongoose');


const cors = require("cors");   // for cors error
const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.json());

// Make the server
var server;
var port = process.env.PORT || process.env.NODE_PORT || 2000;
var mongoDB = 'mongodb://localhost/alliancemgr';

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



// Router listeners
var routes = require("./routes.js");
routes(app);

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