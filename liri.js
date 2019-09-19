require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment")

var spotify = (keys.spotify);

var bandsInTown = keys.bandsInTown.id
console.log(spotify)
console.log(bandsInTown)

var command = process.argv[2];

switch (command) {
    case "concert-this":
        var artist = process.argv[3]
        var urlArtist = artist.split(' ').join('%20');
        console.log(urlArtist)
        queryURL = `https://rest.bandsintown.com/artists/${urlArtist}/events?${bandsInTown}`
        console.log(queryURL)
        axios.get(queryURL).then(
            function (response) {
                console.log(response.data.length)
                for (var i = 0; i < response.data.length; i++) {
                    var date = moment(response.data[i].datetime)


                    console.log("Concert venue name: " + response.data[i].venue.name);
                    console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                    console.log(date.format("MMMM Do YYYY"))
                    console.log("")
                    console.log("--------------------------------------------------------------")


                }
            },

            function (error) {
                if (error.response) {
                    //The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an object that comes back with details pertaining to the error that occurred.
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log("Error", error.message);
                }
                console.log(error.config);
            }
        )
}       