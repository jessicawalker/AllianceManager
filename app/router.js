const path = require("path");
const clientPath = path.resolve(__dirname + "/../client");

// Router listeners
var router = function(app) {
    app.get("/", function(req, res) {
        res.status(200).sendFile(clientPath + "/index.html");
    });
    app.get("/write-data", function(req, res) {
        res.status(200).sendFile(clientPath + "/write-data.html");
    });

    app.get("/browse-users", function(req, res) {
        res.status(200).sendFile(clientPath + "/browse-users.html");
    });

    app.get("/view-user", function(req, res) {
        res.status(200).sendFile(clientPath + "/view-user.html");
    });
};

module.exports = router;