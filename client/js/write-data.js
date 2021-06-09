var app = angular.module("writeMoviesApp", []);

app.controller("writeMoviesController", function($scope, $http) {
    $scope.submitMovie = function() {

        $http({
            method: "POST",
            url: evgURL + "/write-record",
            data: {
                "rank": $scope.rank,
                "movieTitle": $scope.movieTitle,
                "year": $scope.year,
                "director": $scope.director,
                "rating": $scope.rating,
                "users": $scope.users
            }
        }).then(function(response) {

            if (rank == "" || movieTitle == "" || year == "" || director == "" || rating == "" || users == "") {
                return;
            }
            if (response.statusText === "OK") {
                $scope.addResults = "Movie record successfully added:\n" +
                    "\nRank: " + $scope.rank +
                    "\nMovie Title: " + $scope.movieTitle +
                    "\nYear: " + $scope.year +
                    "\nDirector: " + $scope.director +
                    "\nRating: " + $scope.rating +
                    "\nUsers: " + $scope.users;
                $scope.rank = "";
                $scope.movieTitle = "";
                $scope.year = "";
                $scope.director = "";
                $scope.rating = "";
                $scope.users = "";
                $scope.hideSuccess = false;

            } else {
                $scope.addResults = response.statusText;
            }
        }, function(response) {
            $scope.addResults = response.statusText;
        });
    };
});