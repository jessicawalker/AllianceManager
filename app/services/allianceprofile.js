const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const dbURL = process.env.DB_URI_BASE || "mongodb://localhost";

// Service listeners
var allianceServices = function(app) {

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

    // UPDATE
    app.put("/allianceprofile-update/:id", function(req, res) {
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
};

module.exports = allianceServices;