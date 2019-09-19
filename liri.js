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
        concertThis()
        break;

    case "spotify-this-song":
        ///do something
        break;


}
//function called when argument concert-this is inputed into terminal
function concertThis() {
    var artist = process.argv[3]        //artist is equal to the command given
    var urlArtist = artist.split(' ').join('%20');  //if the artist has a space in the name its replaced by %20 for a legitimate url
    queryURL = `https://rest.bandsintown.com/artists/${urlArtist}/events?${bandsInTown}`        //query parsed together by urlArtist variable and api key in separate file
    axios.get(queryURL).then(
        function (response) {
            for (var i = 0; i < response.data.length; i++) {        //for loop going through the response data
                var date = moment(response.data[i].datetime)            //variable date is assigned to moment parsing through the time stamp given in data
                console.log("--------------------------------------------------------------")
                console.log("")
                console.log("Concert venue name: " + response.data[i].venue.name);
                console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);    //console logging relevant data to the terminal for the user
                console.log("Event date: " + date.format("MMMM DD YYYY"))       //event date is formatted correctly using moment
                console.log("")
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