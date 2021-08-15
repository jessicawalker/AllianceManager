const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const dbURL = process.env.DB_URI || "mongodb://localhost";

// Service listeners
var membersServices = function(app) {

    // READ
    /*app.get("/members", function(req, res) {

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("members").find().toArray(function(err, data) {
                    if (err) {
                        client.close();
                        return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
                    } else {
                        client.close();
                        return res.status(200).send(JSON.stringify({ msg: "SUCCESS", members: data }));
                    }
                });
            }
        });
    });*/
    
    app.get("/members-all", function(req, res) {
        const projection = { _id: 0, member_username: 1 };
        var sortByName = { member_username: 1 };

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("members").find({ current_member: { $in: [true, false]}}).project(projection).sort(sortByName).toArray(function(err, data) {
                    if (err) {
                        client.close();
                        return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
                    } else {
                        client.close();
                        return res.status(200).send(JSON.stringify({ msg: "SUCCESS", members: data }));
                    }
                });
            }
        });
    });

    app.get("/members-current", function(req, res) {

        const projection = { _id: 0, member_username: 1 };
        var sortByName = { member_username: 1 };

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("members").find({current_member: true}).project(projection).sort(sortByName).toArray(function(err, data) {
                    if (err) {
                        client.close();
                        return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
                    } else {
                        client.close();
                        return res.status(200).send(JSON.stringify({ msg: "SUCCESS", members: data }));
                    }
                });
            }
        });
    });


    // WRITE
    app.post("/members-add", function(req, res) {

        var addTimestamp = new Date(Date.now());
        var newMemberEntry = {
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

    // DELETE
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

    // UPDATE
    app.put("/members-update/:id", function(req, res) {
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

};

module.exports = membersServices;