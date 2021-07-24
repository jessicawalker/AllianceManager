const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const dbURL = process.env.DB_URI || "mongodb://localhost";

// Service listeners
var criteriaServices = function(app) {

    // WRITE
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

    // DELETE
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
    });
};

module.exports = criteriaServices;