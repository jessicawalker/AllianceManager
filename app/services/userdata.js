const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const dbURL = process.env.DB_URI_BASE || "mongodb://localhost";

// Service listeners
// === ALL DB REFERENCES GO TO USERDATATEST - change to userdata when ready ===
var userdataServices = function(app) {

    // READ - no pagination    
    app.get("/userdata-filter", function(req, res) {
        var date = req.query.date;
        var dateFormatted =  new Date(req.query.date).toISOString();
        var search = (date === "") ? {} : { date: dateFormatted };

        MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
            } else {
                var dbo = client.db("alliancemgr");

                dbo.collection("userdata").find(search).toArray(function(err, data) {
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
        var userdataID = req.query.id;

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

        var userdataID = req.params.id;
        var s_id = new ObjectId(userdataID);
        var search = { _id: s_id };

        // update fields
        var updateData = {
            $set: req.body             
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