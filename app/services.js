const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const dbURL = process.env.DB_URI || "mongodb://localhost";

// Service listeners
var services = function(app) {
    app.post("/write-record", function(req, res) {

        var newUserEntry = {
            date: req.body.date,
            user: req.body.user,
            claimedSSWar: req.body.claimedSSWar,
            activeDeclare: req.body.activeDeclare,
            defenseEarly: req.body.defenseEarly,
            defenseLive: req.body.defenseLive,
            offense: req.body.offense,
            notes: req.body.notes
        };

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("userdata").insertOne(newUserEntry, function(err, response) {
                    if (err) {
                        client.close();
                        return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
                    } else {
                        client.close();
                        return res.status(200).send(JSON.stringify({ msg: "SUCCESS" }));
                    }
                });
            }
        });
    });

    app.get("/read-records", function(req, res) {
        var sortBy = { date: -1, _id: 1 }; // go back to default sort

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("userdata").find().sort(sortBy).toArray(function(err, data) {
                    if (err) {
                        client.close();
                        return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
                    } else {
                        client.close();
                        return res.status(200).send(JSON.stringify({ msg: "SUCCESS", userdata: data }));
                    }
                });
            }
        });
    });

    // filter output by date and user
    app.get("/get-userdataByValue", function(req, res) {
        var date = req.query.date;
        var user = req.query.user;
        var claimedSSWar;
        var activeDeclare;
        var defenseEarly;
        var defenseLive;
        var offense;
        var sortByValue = req.query.sortByValue;
        var sortBy;

        var searchDate = (date === "") ? {} : { date: new Date(date) };
        var searchUser = (user === "") ? {} : { user: user };

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

        if (req.query.defenseEarly == "true") {
            defenseEarly = { defenseEarly: true };
        } else if (req.query.defenseEarly == "false") {
            defenseEarly = { defenseEarly: false };
        } else {
            defenseEarly = {};
        }

        if (req.query.defenseLive == "true") {
            defenseLive = { defenseLive: true };
        } else if (req.query.defenseLive == "false") {
            defenseLive = { defenseLive: false };
        } else {
            defenseLive = {};
        }

        if (req.query.offense == "true") {
            offense = { offense: true };
        } else if (req.query.offense == "false") {
            offense = { offense: false };
        } else {
            offense = {};
        }

        //var sortBy = { date: -1, _id: 1 }; // go back to default sort


        switch (sortByValue) {
            case "date":
                sortBy = { date: -1, _id: 1 };
                break;
            case "user":
                sortBy = { user: 1, date: -1 };
                break;
            case "claimedSSWar":
                sortBy = { claimedSSWar: -1 };
                break;
            case "activeDeclare":
                sortBy = { activeDeclare: -1 };
                break;
            case "defenseEarly":
                sortBy = { defenseEarly: -1 };
                break;
            case "defenseLive":
                sortBy = { defenseLive: -1 };
                break;
            case "offense":
                sortBy = { offense: -1 };
                break;
            default:
                break;
        }

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("userdata").find({ $and: [searchDate, searchUser, claimedSSWar, activeDeclare, defenseEarly, defenseLive, offense] }).sort(sortBy).toArray(function(err, data) {
                    if (err) {
                        client.close();
                        return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
                    } else {
                        client.close();
                        return res.status(200).send(JSON.stringify({ msg: "SUCCESS", userdata: data }));
                    }
                });
            }
        });
    });

    // sort table by field
    app.get("/sort-records", function(req, res) {
        var sortByValue = req.query.sortByValue;
        var date = req.query.date;
        var search = (date === "") ? {} : { date: date };
        var sortBy;

        switch (sortByValue) {
            case "date":
                sortBy = { date: -1, _id: 1 };
                break;
            case "user":
                sortBy = { user: 1 };
                break;
            case "claimedSSWar":
                sortBy = { claimedSSWar: 1 };
                break;
            case "activeDeclare":
                sortBy = { activeDeclare: 1 };
                break;
            case "defenseEarly":
                sortBy = { defenseEarly: 1 };
                break;
            case "defenseLive":
                sortBy = { defenseLive: 1 };
                break;
            case "offense":
                sortBy = { offense: 1 };
                break;
            case "notes":
                sortBy = { notes: 1 };
                break;
            default:
                break;
        }

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("userdata").find(search).sort(sortBy).toArray(function(err, data) {
                    if (err) {
                        client.close();
                        return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
                    } else {
                        client.close();
                        return res.status(200).send(JSON.stringify({ msg: "SUCCESS", userdata: data }));
                    }
                });
            }
        });
    });

    // remove a record
    app.delete("/delete-record", function(req, res) {
        var userdataID = req.query.userdataID;

        var s_id = new ObjectId(userdataID);
        var search = { _id: s_id };

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("userdata").deleteOne(search, function(err, response) {
                    if (err) {
                        return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
                    } else {
                        client.close();
                        return res.status(200).send(JSON.stringify({ msg: "SUCCESS" }));
                    }
                });
            }
        });
    });

    app.put("/update-record", function(req, res) {
        var userdataID = req.body.userdataID;
        var date = req.body.date;
        var user = req.body.user;
        var claimedSSWar = req.body.claimedSSWar;
        var activeDeclare = req.body.activeDeclare;
        var defenseEarly = req.body.defenseEarly;
        var defenseLive = req.body.defenseLive;
        var offense = req.body.offense;
        var notes = req.body.notes;

        var s_id = new ObjectId(userdataID);

        var search = { _id: s_id };

        var updateData = {
            $set: {
                date: date,
                user: user,
                claimedSSWar: claimedSSWar,
                activeDeclare: activeDeclare,
                defenseEarly: defenseEarly,
                defenseLive: defenseLive,
                offense: offense,
                notes: notes
            }
        };


        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("userdata").updateOne(search, updateData, function(err, response) {
                    if (err) {
                        client.close();
                        return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
                    } else {
                        client.close();
                        return res.status(200).send(JSON.stringify({ msg: "SUCCESS" }));
                    }
                });
            }
        });
    });
};

module.exports = services;