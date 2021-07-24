const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const dbURL = process.env.DB_URI || "mongodb://localhost";
const AllianceProfile = require('./allianceprofile');
const Members = require('./members');
const TrackingCriteria = require('./trackingcriteria');

// Service listeners
var services = function(app) {
    AllianceProfile(app);
    Members(app);
    TrackingCriteria(app);
/*
    // WRITE
    app.post("/allianceprofile-add", function(req, res) {

        var newAllianceEntry = {
            alliance_name: req.body.alliance_name,
            game_name: req.body.game_name
        };

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("allianceprofile").insertOne(newAllianceEntry, function(err, response) {
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

    app.post("/members-add", function(req, res) {

        var addTimestamp = new Date(Date.now());
        var newMemberEntry = {
            member_username: req.body.member_username,
            member_role: req.body.member_role,
            member_notes: req.body.member_note,
            current_member: req.body.current_member,
            member_added_date: addTimestamp.toUTCString()
        };

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("members").insertOne(newMemberEntry, function(err, response) {
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

    app.post("trackingcriteria-add", function(req, res) {

        var newCriteriaEntry = {
            criteria_name: req.body.criteria_name,
            criteria_datatype: req.body.criteria_datatype
        };

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("trackingcriteria").insertOne(newCriteriaEntry, function(err, response) {
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

    // READ
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
    app.delete("/members-delete/:id", function(req, res) {
        var memberID = req.params.id;

        var s_id = new ObjectId(memberID);
        var search = { _id: s_id };

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("members").deleteOne(search, function(err, response) {
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
    
    app.delete("/trackingcriteria-delete/:id", function(req, res) {
        var trackingcriteriaID = req.params.id;

        var s_id = new ObjectId(trackingcriteriaID);
        var search = { _id: s_id };

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("trackingcriteria").deleteOne(search, function(err, response) {
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

    // UPDATE

    app.put("/allianceprofile-update/:id", function(req, res) {
        console.log("Begin update");
        var allianceID = req.params.id;
        var alliance_name = req.body.alliance_name;
        var game_name = req.body.game_name;

        var s_id = new ObjectId(allianceID);

        var search = { _id: s_id };

        var updateData = {
            $set: {
                alliance_name: alliance_name,
                game_name: game_name
            }
        };

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("allianceprofile").updateOne(search, updateData, function(err, response) {
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


    app.put("/members-update/:id", function(req, res) {
        console.log("Begin update");
        var memberID = req.params.id;
        var member_username = req.body.member_username;
        var member_role = req.body.member_role;
        var member_notes = req.body.member_notes;
        var current_member = req.body.current_member;

        var s_id = new ObjectId(memberID);

        var search = { _id: s_id };

        var updateData = {
            $set: {
                member_username: member_username,
                member_role: member_role,
                member_notes: member_notes,
                current_member: current_member
            }
        };

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("members").updateOne(search, updateData, function(err, response) {
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

    app.put("/trackingcriteria-update/:id", function(req, res) {
        console.log("Begin update");
        var criteriaID = req.params.id;
        var criteria_name = req.body.criteria_name;
        var criteria_datatype = req.body.criteria_datatype;

        var s_id = new ObjectId(criteriaID);

        var search = { _id: s_id };

        var updateData = {
            $set: {
                criteria_name: criteria_name,
                criteria_datatype: criteria_datatype
            }
        };

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("trackingcriteria").updateOne(search, updateData, function(err, response) {
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
    });*/
};

module.exports = services;