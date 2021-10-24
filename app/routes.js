const express = require('express');
const Activity = require('./schema/activities');
const AllianceProfile = require('./schema/allianceprofile');
const Members = require('./schema/members');
const TrackingCriteria = require('./schema/trackingcriteria');
const Userdata = require('./schema/userdata');
// TODO - take non-userdata out of the pagination results function, just regular get
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
    app.get('/activities', paginatedResults(Activity), (req, res) => {
        res.json(res.paginatedResults);
    });
    /*app.get('/activities', uniqueResults(TrackingCriteria), (req, res) => {
        res.json(res.uniqueResults);
    });*/
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
        const sortByReverse = req.query.sortByReverse;
        let sortBy = { date: -1, _id: 1 }; // default value
        
        // filters
        const searchDate = (date === "" || date === undefined) ? {} : { date: date };
        const searchUser = (user === "" || user === undefined) ? {} : { user: user };
        const searchCustom = (req.query.filter === "" || req.query.filter === undefined) ? {} : JSON.parse(req.query.filter);

        // pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        //sort
        switch (sortByValue) {
            case "date":
                sortBy = sortByReverse ? { date: 1, _id: 1 } : { date: -1, _id: 1 };
                //sortBy = { date: -1, _id: 1 };
                break;
            case "user":
                sortBy = sortByReverse ? { user: -1, date: -1 } : { user: 1, date: -1 };
                //sortBy = { user: 1, date: -1 };
                break;
            default:
                break;
        }


        // returned data
        const results = {};
        const searchValues = { $and: [searchDate, searchUser, searchCustom] };

        if (endIndex < await model.countDocuments(searchValues).exec()) {
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
            results.results = await model.find(searchValues).sort(sortBy).limit(limit).skip(startIndex).exec();
            res.paginatedResults = results;
            results.total = await model.countDocuments(searchValues).exec();
            next();
        } catch (e) {
            res.status(500).json({ message: e.message });
        }

        //console.log(res);
    };
}


function uniqueResults(model) {
    return async (req, res, next) => {
        const unique = req.query.unique;
        const results = {};
        console.log(req.query.unique);

        try {
            if (unique !== "user" && unique !== undefined) {
                results.results = await model.distinct(unique).exec();
                res.uniqueResults = results;
                console.log(results);
            }
            next();
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    };
}

module.exports = routes;