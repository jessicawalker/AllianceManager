const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const dbURL = process.env.DB_URI || "mongodb://localhost";

// Service listeners
// === ALL DB REFERENCES GO TO USERDATATEST - change to userdata when ready ===
var userdataServices = function(app) {

    // READ
/*
    app.get("/userdata", function(req, res) {
        console.log("======Request======: " + req);

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("userdatatest").find().toArray(function(err, data) {
                    if (err) {
                        client.close();
                        return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
                    } else {
                        client.close();
                        return res.status(200).send(JSON.stringify({ msg: "SUCCESS", results: data }));
                    }
                });
            }
        });
    });*/

    app.get("/userdata-filter", function(req, res) {
        var date = req.query.date;
        var dateFormatted =  new Date(req.query.date).toISOString();
        console.log("req.query: " + req.query);
        console.log("date: " + date);
        //var search = (date === "") ? {} : { date: new Date(date).toISOString() };
        var search = (date === "") ? {} : { date: dateFormatted };
        //var search = (date === "") ? {} : { date: date };
        console.log("search: " + JSON.stringify(search));

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("userdatatest").find(search).toArray(function(err, data) {
                    if (err) {
                        client.close();
                        return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
                    } else {
                        client.close();
                        return res.status(200).send(JSON.stringify({ msg: "SUCCESS", results: data }));
                    }
                });
            }
        });
    });


    // WRITE
    app.post("/userdata-add", function(req, res) {

        var newUserdataEntry = req.body.addMemberEntry;
        console.log(req.body);
        console.log(req.body.addMemberEntry);
        console.log(newUserdataEntry);

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("userdatatest").insertOne(newUserdataEntry, function(err, response) {
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
        var userdataID = req.query.id;

        var s_id = new ObjectId(userdataID);
        var search = { _id: s_id };

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("userdatatest").deleteOne(search, function(err, response) {
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
        var fieldName = req.body.fieldName;
        var trackData = req.body.trackData;
        var userdataID = req.query.id;
        var s_id = new ObjectId(userdataID);
        var search = { _id: s_id };

        var updateObj = {};
        updateObj[fieldName] = trackData;

        var updateData = {
            $set: {
                updateObj
                //fieldName: trackData
            }
        };

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("userdatatest").updateOne(search, updateData, function(err, response) {
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