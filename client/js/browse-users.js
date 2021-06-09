/*
To-dos:
* Distinguish active and inactive users
  * Add if left or kicked
* Pagination
* Generate sorting report of most "failures"
*/

var app = angular.module("userdataTableApp", []);

app.controller("userdataTableController", function($scope, $http) {
    $scope.userdata = [];
    $scope.dataArray = []; // test
    $scope.dates = [];
    $scope.users = [];
    $scope.tOrF = [{ value: "", display: "- All -" }, { value: true, display: "true" }, { value: false, display: "false" }];
    $scope.sortBy = [{ value: "date", display: "Date" }, { value: "user", display: "User" }, { value: "claimedSSWar", display: "Claimed SS - War Phase" }, { value: "activeDeclare", display: "Active - Declare Phase" }, { value: "defenseEarly", display: "Placed Defense Early" }, { value: "defenseLive", display: "Placed Defense Live" }, { value: "offense", display: "Placed Offense" }];

    $scope.get_users = function() {
        $http({
            method: "GET",
            url: evgURL + "/read-records"
        }).then(function(response) {
            if (response.data.msg === "SUCCESS") {
                $scope.userdata = response.data.userdata;
                $scope.dataArray = getArray(response.data.userdata); // test
                $scope.dates = getDates(response.data.userdata);
                $scope.users = getUsers(response.data.userdata);
                $scope.selectedDate = $scope.dates[0];
                $scope.selectedUser = $scope.users[0];
                $scope.selectedClaimed = $scope.tOrF[0];
                $scope.selectedActiveDeclare = $scope.tOrF[0];
                $scope.selectedDefenseEarly = $scope.tOrF[0];
                $scope.selectedDefenseLive = $scope.tOrF[0];
                $scope.selectedOffense = $scope.tOrF[0];
                $scope.selectedSortBy = $scope.sortBy[0];
            } else {
                console.log(response.data.msg);
            }
        }, function(response) {
            console.log(response);
        });
    };

    $scope.get_users();

    $scope.redrawTable = function() {
        var date = $scope.selectedDate.value;
        var user = $scope.selectedUser.value;
        var claimedSSWar = $scope.selectedClaimed.value;
        var activeDeclare = $scope.selectedActiveDeclare.value;
        var defenseEarly = $scope.selectedDefenseEarly.value;
        var defenseLive = $scope.selectedDefenseLive.value;
        var offense = $scope.selectedOffense.value;
        var sortByValue = $scope.selectedSortBy.value;

        $http({
            method: "GET",
            url: evgURL + "/get-userdataByValue",
            params: { date: date, user: user, claimedSSWar: claimedSSWar, activeDeclare: activeDeclare, defenseEarly: defenseEarly, defenseLive: defenseLive, offense: offense, sortByValue: sortByValue }
        }).then(function(response) {
            if (response.data.msg === "SUCCESS") {
                $scope.userdata = response.data.userdata;
                //toggleHide(date, "date");
                //toggleHide(user, "user");
            } else {
                console.log(response.data.msg);
            }
        }, function(response) {
            console.log(response);
        });
    };

    $scope.sortTable = function() {
        var sortByValue = $scope.selectedSortBy.value;
        var date = $scope.selectedDate.value;

        $http({
            method: "GET",
            url: evgURL + "/sort-records",
            params: { sortByKey: sortByValue, date: date }
        }).then(function(response) {
            if (response.data.msg === "SUCCESS") {
                $scope.userdata = response.data.userdata;
            } else {
                console.log(response.data.msg);
            }
        }, function(response) {
            console.log(response);
        });
    };
});


function getDates(userdataArray) {
    var dateExists;

    var datesArray = [{ value: "", display: "- All Dates -" }];
    for (var i = 0; i < userdataArray.length; i++) {
        //for (var i = userdataArray.length - 1; i >= 0; i--) {
        dateExists = datesArray.find(function(element) {
            return element.value === userdataArray[i].date;
        });

        if (dateExists) {
            continue;
        } else {
            var origDate = new Date(userdataArray[i].date);
            var readableDate = origDate.toDateString();
            datesArray.push({ value: userdataArray[i].date, display: readableDate });
        }
    }
    return datesArray;
}

function getUsers(userdataArray) {
    var userExists;
    var userList = "";

    var usersArray = [{ value: "", display: "- All Users -" }];
    for (var i = 0; i < userdataArray.length; i++) {
        userExists = usersArray.find(function(element) {
            return element.value === userdataArray[i].user;
        });

        if (userExists) {
            continue;
        } else {
            usersArray.push({ value: userdataArray[i].user, display: userdataArray[i].user });
            userList += userdataArray[i].user + " ";
        }
    }
    usersArray.sort((a, b) => (a.display.toLowerCase() > b.display.toLowerCase()) ? 1 : -1);
    return usersArray;
}

// test
function getArray(userdataArray) {
    var usersArrayJson = [];
    for (var i = 0; i < userdataArray.length; i++) {

        usersArrayJson.push({ date: userdataArray[i].date, user: userdataArray[i].user });
    }
    //usersArray.sort((a, b) => (a.display.toLowerCase() > b.display.toLowerCase()) ? 1 : -1);
    return usersArrayJson;
}

// if date or user is NOT empty, add the "hide" class to the elements with the date or user class
// this isn't playing nice with AngularJS
function toggleHide(value, tdClass, list) {
    if (value != "") {
        if (tdClass == "date") {
            //dateClassList.classList.add("hideMobile");
            for (var e in list) {
                //e.classList.add("hideMobile");
                console.log(e.innerText);
            }
        }
        if (tdClass == "user") {
            //userClassList.classList.add("hideMobile");
            for (var f in list) {
                //f.classList.add("hideMobile");
                console.log(f.innerText);
            }
        }
    }

    if (value == "") {
        if (tdClass == "date") {
            //dateClassList.classList.remove("hideMobile");
            for (var g in list) {
                //g.classList.remove("hideMobile");
                console.log(g.innerText);
            }
        }
        if (tdClass == "user") {
            //userClassList.classList.remove("hideMobile");
            for (var h in list) {
                //h.classList.remove("hideMobile");
                console.log(h.innerText);
            }
        }
    }
}

$(document).ready(function() {
    $("#moreOptions").click(function() {
        $("#viewOptions").slideToggle("slow");
    });
});