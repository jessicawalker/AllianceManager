const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const dbURL = process.env.DB_URI_BASE || "mongodb://localhost";

// Service listeners
var activityServices = function(app) {

    // WRITE
    app.post("/activities-add", function(req, res) {

        var newActivityEntry = {
            activity_name: req.body.activity_name,
            activity_key: req.body.activity_name.toLowerCase().replace(/\s/g, ''),
            log_type: req.body.log_type
        };

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("activities").insertOne(newActivityEntry, function(err, response) {
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
    app.delete("/activities-delete/:id", function(req, res) {
        var activityID = req.params.id;

        var s_id = new ObjectId(activityID.trim());
        var search = { _id: s_id };

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("activities").deleteOne(search, function(err, response) {
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
    app.put("/activities-update/:id", function(req, res) {
        var activityID = req.params.id;
        var activity_name = req.body.activity_name;
        var activity_key = req.body.activity_name.toLowerCase().replace(/\s/g, '');
        var log_type = req.body.log_type;

        var s_id = new ObjectId(activityID.trim());

        var search = { _id: s_id };

        var updateData = {
            $set: {
                activity_name: activity_name,
                activity_key: activity_key,
                log_type: log_type
            }
        };

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("activities").updateOne(search, updateData, function(err, response) {
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

module.exports = activityServices;