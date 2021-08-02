const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const dbURL = process.env.DB_URI || "mongodb://localhost";

// Service listeners
var userdataServices = function(app) {

    // READ
    app.get("/userdata", function(req, res) {

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("userdata").find().toArray(function(err, data) {
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


    // WRITE
    app.post("/userdata-add", function(req, res) {

        // update fields
        var addTimestamp = new Date(Date.now());
        var newUserdataEntry = {
            member_username: req.body.member_username,
            member_role: req.body.member_role,
            member_notes: req.body.member_notes,
            current_member: req.body.current_member,
            member_added_date: addTimestamp.toUTCString()
        };

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("userdata").insertOne(newUserdataEntry, function(err, response) {
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
    app.delete("/userdata-delete/:id", function(req, res) {
        var userdataID = req.params.id;

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

    // UPDATE
    app.put("/userdata-update/:id", function(req, res) {

        // update fields
        var userdataID = req.params.id;
        var member_username = req.body.member_username;
        var member_role = req.body.member_role;
        var member_notes = req.body.member_notes;
        var current_member = req.body.current_member;

        var s_id = new ObjectId(userdataID);

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

module.exports = userdataServices;