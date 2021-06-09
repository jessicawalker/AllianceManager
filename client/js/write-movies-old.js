// display data entered by user
displayInput();

function displayInput() {
    var successAdded = document.getElementById("success-added");
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var successMessage = "Movie record successfully added:<br>";

    // don't display box if nothing has been submitted
    if (urlParams.has("rank")) {
        successAdded.style.opacity = "1";
    }

    //const values = urlParams.values()
    var entries = urlParams.entries();
    for (var entry of entries) {
        successMessage += "<br>\n";
        successMessage += `${entry[0]}: ${entry[1]}`;
    }
    successAdded.innerHTML = successMessage;
}

// function called from write-movies page, script near bottom on page

$("#data-submit").click(function() {

    // gets value from form fields
    var rank = $("#rank").val();
    var movieTitle = $("#movieTitle").val();
    var year = $("#year").val();
    var director = $("#director").val();
    var rating = $("#rating").val();
    var users = $("#users").val();

    if (rank == "" || movieTitle == "" || year == "" || director == "" || rating == "" || users == "") {
        return;
    }

    var d = new Date();
    var ID = "mov" + d.getTime();

    var jsonString = JSON.stringify({
        ID: ID,
        rank: rank,
        movieTitle: movieTitle,
        year: year,
        director: director,
        rating: rating,
        users: users
    });

    // POST method passes "data" value to req.body.data, sent to app.post("/write-record")
    $.ajax({
        url: moviesURL + "/write-record",
        type: "post",
        data: { data: jsonString }, // var data = req.body.data;
        success: function(response) {
            successAdded.innerHTML = jsonString;
        },
        error: function(err) {
            alert(err);
        }
    });
});