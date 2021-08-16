const express = require('express');
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
        res.json(res.paginatedResults);
    });
    app.get('/userdata-unique', uniqueResults(Userdata), (req, res) => {
        res.json(res.uniqueResults);
    });
};

function paginatedResults(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const date = req.query.date;
        const user = req.query.user;
        const sortByValue = req.query.sortBy;
        console.log("req.query.sortBy: " + req.query.sortBy);
        let sortBy = { date: -1, _id: 1 }; // default value
        
        // filters
        const searchDate = (date === "" || date === undefined) ? {} : { date: date };
        const searchUser = (user === "" || user === undefined) ? {} : { user: user };

        // pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

//sort
        switch (sortByValue) {
            case "date":
                sortBy = { date: -1, _id: 1 };
                break;
            case "user":
                sortBy = { user: 1, date: -1 };
                break;
            default:
                break;
        }

        // returned data
        const results = {};
        //const sortBy = { sortByValue: -1, _id: 1 };

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

        results.total = await model.countDocuments().exec();

        try {
            results.results = await model.find({ $and: [searchDate, searchUser] }).sort(sortBy).limit(limit).skip(startIndex).exec();
            console.log("results: " + results);
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