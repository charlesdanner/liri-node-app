require("dotenv").config();
var Spotify = require('node-spotify-api')


var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment")

var spotify = new Spotify(keys.spotify);

var bandsInTown = keys.bandsInTown.id
var omdb = keys.omdb.id
console.log(spotify)
console.log(bandsInTown)

var command = process.argv[2];

switch (command) {
    case "concert-this":
        concertThis()
        break;

    case "spotify-this-song":
        spotifyThisSong()
        break;

    case "movie-this":    
        movieThis()
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

function spotifyThisSong(){

}

function movieThis(){
    var movie
    if(process.argv[3]){
        movie = process.argv[3].split(" ").join("+");
    } else movie = "mr+nobody"
    
    queryURL = `http://www.omdbapi.com/?t=${movie}&y=&plot=short&apikey=${omdb}`
     axios.get(queryURL).then(
         function(response){
             var movie = response.data
             console.log(`Title: ${movie.Title}`)
             console.log(`Year Released: ${movie.Year}`)
             console.log(`IMDB Rating: ${movie.Ratings[0].Value}`)
             console.log(`Rotten Tomatos Rating: ${movie.Ratings[1].Value}`)
             console.log(`Country Produced in: ${movie.Country}`)
             console.log(`Original Language: ${movie.Language}`)
             console.log(`Plot: ${movie.Plot}`)
             console.log(`Actors: ${movie.Actors}`)
         }
     )
}