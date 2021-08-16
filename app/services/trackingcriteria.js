const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const dbURL = process.env.DB_URI_BASE || "mongodb://localhost";

// Service listeners
var criteriaServices = function(app) {

    // WRITE
    app.post("/trackingcriteria-add", function(req, res) {

        var newCriteriaEntry = {
            criteria_name: req.body.criteria_name,
            criteria_datatype: req.body.criteria_datatype,
            criteria_key: req.body.criteria_name.toLowerCase().replace(/\s/g, '')
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

        var s_id = new ObjectId(trackingcriteriaID.trim());
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
        var criteriaID = req.params.id;
        var criteria_name = req.body.criteria_name;
        var criteria_datatype = req.body.criteria_datatype;
        var criteria_key = req.body.criteria_name.toLowerCase().replace(/\s/g, '');

        var s_id = new ObjectId(criteriaID.trim());

        var search = { _id: s_id };

        var updateData = {
            $set: {
                criteria_name: criteria_name,
                criteria_datatype: criteria_datatype,
                criteria_key: criteria_key
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
};

module.exports = criteriaServices;