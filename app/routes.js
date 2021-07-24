const path = require("path");
//const clientPath = path.resolve(__dirname + "/../client");
const express = require('express');
const router = express.Router();
const AllianceProfile = require('./allianceprofile');
const Members = require('./members');
const TrackingCriteria = require('./trackingcriteria');

// Router listeners
var routes = function (app) {
    app.get('/allianceprofile', paginatedResults(AllianceProfile), (req, res) => {
        res.json(res.paginatedResults);
    });
    /*app.put('/allianceprofile/update', (req, res) => {
        console.log(req);
        res.json(res.paginatedResults);
    });*/
    /*app.put('/allianceprofile/update', getAlliance, async (req, res) => {
        if (req.body.alliance_name != null) {
            res.allianceprofile.alliance_name = req.body.alliance_name;
        }
        if (req.body.subscribedToChannel != null) {
            res.allianceprofile.game_name = req.body.game_name;
        }
        try {
            const updatedAlliance = await res.allianceprofile.save();
            res.json(updatedAlliance)
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });*/
    app.get('/members', paginatedResults(Members), (req, res) => {
        res.json(res.paginatedResults);
    });
    app.get('/trackingcriteria', paginatedResults(TrackingCriteria), (req, res) => {
        res.json(res.paginatedResults);
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

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};

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
            results.results = await model.find().limit(limit).skip(startIndex).exec();
            res.paginatedResults = results;
            //console.log(results);
            //console.log(model.find());
            next();
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    };
}


module.exports = routes;