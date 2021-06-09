var movies = [];
var activeMovie = 0;

var app = angular.module("viewMoviesApp", []);

app.controller("viewMoviesController", function($scope, $http) {
    $scope.movies = [];

    $scope.get_movies = function() {
        $http({
            method: "GET",
            url: evgURL + "/read-records"
        }).then(function(response) {
            if (response.data.msg === "SUCCESS") {
                movies = response.data.moviedata;
                $scope.obj = movies[activeMovie];
                $scope.showHide();
            } else {
                $scope.addResults = response.data.msg;
            }
        }, function(response) {
            console.log(response);
        });
    };

    $scope.get_movies();

    $scope.changeMovie = function(direction) {
        activeMovie += direction;
        $scope.obj = movies[activeMovie];
        $scope.showHide();
    }

    $scope.showHide = function() {
        $scope.hidePrev = (activeMovie === 0) ? true : false;
        $scope.hideNext = (activeMovie === movies.length - 1) ? true : false;
    };
});