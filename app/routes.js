const path = require("path");
//const clientPath = path.resolve(__dirname + "/../client");
const express = require('express');
const router = express.Router();
const AllianceProfile = require('./schema/allianceprofile');
const Members = require('./schema/members');
const TrackingCriteria = require('./schema/trackingcriteria');
const Userdata = require('./schema/userdata');

// Router listeners
var routes = function (app) {
    app.get('/allianceprofile', paginatedResults(AllianceProfile), (req, res) => {
        res.json(res.paginatedResults);
    });
    app.get('/members', paginatedResults(Members), (req, res) => {
        res.json(res.paginatedResults);
    });
    app.get('/trackingcriteria', paginatedResults(TrackingCriteria), (req, res) => {
        res.json(res.paginatedResults);
    });
    app.get('/userdata', paginatedResults(Userdata), (req, res) => {
        //console.log(req);
        res.json(res.paginatedResults);
    });
    app.get('/userdata-unique', uniqueResults(Userdata), (req, res) => {
        res.json(res.uniqueResults);
    });
};

async function getAlliance(req, res, next) {
    let alliance;
    try {
        alliance = await AllianceProfile.findById(req.body._id);
        if (alliance == null) {
            return res.status(404).json({ message: 'Cannot find alliance' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

function paginatedResults(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const date = req.query.date;
        const user = req.query.user;

        console.log("===============");
        console.log("req.query.user: " + req.query.user);
        console.log("req.query.date: " + req.query.date);
        //console.log("req.query.date.toString(): " + req.query.date.toString());
        console.log("user: " + user);
        console.log("date: " + date);
        //console.log(dateFormatted);
        //console.log(req);
        console.log(req.query);
        console.log(req.params);
        //console.log(req.query);
        //console.log(Object.fromEntries(req.query));
        console.log(Object.keys(req.query));
        console.log(Object.values(req.query));
        //const filter = req.query.filter;
        //console.log("req log: " + req);
        //console.dir("req dir: " + req);
        //console.log("req.query: " + req.query);
        //console.log("req.params: " + req.params);
        //console.log("req.query.filter: " + req.query.filter);

        // [searchDate,  searchUser]
        // [{date: new Date},  { user: user }]
        // [{claimedSSWar: true},  { activeDeclare: false }]
        // [searchDate,  searchUser, ??????]
        // [searchDate,  searchUser, filter]
        // [{date: new Date}, { user: user }, { claimedSSWar: true }, { activeDeclare: false }]
        var search = req.query.filter;
        var searchDate = (date === "" || date === undefined) ? {} : { date: date };
        var searchUser = (user === "" || user === undefined) ? {} : { user: user };
        console.log("searchDate: " + searchDate);
        console.log("searchUser: " + searchUser);
        //search = searchDate;

        // search = [searchDate, searchUser, ??????]
        // search.append(searchDate)
        // search.append(searchUser)
        // search.append(filter)   ===> [{claimedSSWar: true},  { activeDeclare: false }] *************

        //console.log(req.query.date);
        //console.log(date);
        //console.log(searchDate);
        /*
        if (req.query.claimedSSWar == "true") {
            claimedSSWar = { claimedSSWar: true };
        } else if (req.query.claimedSSWar == "false") {
            claimedSSWar = { claimedSSWar: false };
        } else {
            claimedSSWar = {};
        }
        if (req.query.activeDeclare == "true") {
            activeDeclare = { activeDeclare: true };
        } else if (req.query.activeDeclare == "false") {
            activeDeclare = { activeDeclare: false };
        } else {
            activeDeclare = {};
        }
        */

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};
        const sortBy = { date: -1, _id: 1 };    // make this changeable

        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            };
        }
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            };
        }

        try {
            //results.results = await model.find().sort(sortBy).limit(limit).skip(startIndex).exec();
            //results.results = await model.find(searchUser).sort(sortBy).limit(limit).skip(startIndex).exec();
            results.results = await model.find({ $and: [searchDate, searchUser] }).sort(sortBy).limit(limit).skip(startIndex).exec();
            console.log("results: " + results);
            //console.log("results.results: " + results.results);
            //results.results = await model.find({ $and: [searchDate, searchUser, filter] }).limit(limit).skip(startIndex).exec();
            //dbo.collection("userdata").find({ $and: [searchDate, searchUser, claimedSSWar, activeDeclare, defenseEarly, defenseLive, offense] }).sort(sortBy).toArray(function(err, data) {
            //dbo.collection("userdata").find({ $and: [searchDate, searchUser, { claimedSSWar: true }, { activeDeclare: false }, defenseEarly, defenseLive, offense] }).sort(sortBy).toArray(function(err, data) {
            res.paginatedResults = results;
            next();
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    };
}


function uniqueResults(model) {
    return async (req, res, next) => {
        const unique = req.query.unique;
        const results = {};

        try {
            if (unique !== "user" && unique !== undefined) {
                results.results = await model.distinct(unique).exec();
                res.uniqueResults = results;
            }
            next();
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    };
}

module.exports = routes;