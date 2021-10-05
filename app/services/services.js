const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const dbURL = process.env.DB_URI || "mongodb://localhost";
const Activities = require('./activities');
const AllianceProfile = require('./allianceprofile');
const Members = require('./members');
const TrackingCriteria = require('./trackingcriteria');
const Userdata = require('./userdata');

// Service listeners
var services = function(app) {
    AllianceProfile(app);
    Activities(app);
    Members(app);
    TrackingCriteria(app);
    Userdata(app);
};

module.exports = services;