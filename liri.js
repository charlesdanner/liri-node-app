require("dotenv").config();


const Spotify = require('node-spotify-api')
const keys = require("./keys.js");
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
const spotify = new Spotify(keys.spotify);
const bandsInTown = keys.bandsInTown.id;
const omdb = keys.omdb.id;
const inquirer = require("inquirer");



var command = process.argv[2];
var parameter;
var commandLogged = false;


var runApp = () => {

    switch (command) {
        case "concert-this":
            concertThis()
            pushLog()
            break;

        case "spotify-this-song":
            spotifyThisSong()
            pushLog()
            break;

        case "movie-this":
            movieThis()
            pushLog()
            break;

        case "do-what-it-says":
            doWhatItSays()
            pushLog()
            break;

    }

}

var combineParameters = () => {
    var parameterArr = [];
    for (i = 3; i < process.argv.length; i++) {
        parameterArr.push(process.argv[i]);
    }
    parameter = parameterArr.join(" ");
}

//function called when argument concert-this is inputed into terminal
var concertThis = () => {
    var artist = parameter;        //artist is equal to the command given
    var urlArtist = artist.split(' ').join('%20');  //if the artist has a space in the name its replaced by %20 for a legitimate url
    urlArtist.replace('"', '');
    queryURL = `https://rest.bandsintown.com/artists/${urlArtist}/events?${bandsInTown}`        //query parsed together by urlArtist variable and api key in separate file
    axios.get(queryURL).then(
        function (response) {
            for (var i = 0; i < response.data.length; i++) {        //for loop going through the response data
                var date = moment(response.data[i].datetime)  //variable date is assigned to moment parsing through the time stamp given in data
                console.log( //console logging relevant data to the terminal for the user 
                    //event date is formatted correctly using moment

`--------------------------------------------------------------

Concert venue name: ${response.data[i].venue.name}
Location: ${response.data[i].venue.city}, ${response.data[i].venue.country} 
Event date: ${date.format("MMMM DD YYYY")}

--------------------------------------------------------------
`
                )
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

var spotifyThisSong = () => {
    var songTitle
    var artist
    var album
    var song
    var preview
    if (parameter) {
        songTitle = parameter
    } else songTitle = "the sign"

    spotify.search({ type: 'track', query: songTitle })
        .then(function (response) {

            if (parameter) {
                artist = response.tracks.items[0].album.artists[0].name;
                album = response.tracks.items[0].album.name
                song = response.tracks.items[0].name
                preview = response.tracks.items[0].preview_url
            } else {
                for (var i = 0; i < response.tracks.items.length; i++) {
                    if ((response.tracks.items[i].album.artists[0].name === "Ace of Base") && (response.tracks.items[i].name === "The Sign")) {
                        artist = (response.tracks.items[i].album.artists[0].name);
                        album = response.tracks.items[i].album.name
                        song = response.tracks.items[i].name
                        preview = response.tracks.items[i].preview_url
                    }
                }
            }
            console.log(
                `--------------------------------------------------------------

Artist: ${artist}
From the album: ${album}
Song title: ${song}
Link to a preview of song: ${preview}

--------------------------------------------------------------`
            )})
        .catch(function (err) {
            console.log(err);
        });

}

var movieThis = () => {
    var movie
    if (parameter) {
        movie = parameter.split(" ").join("+");
    } else movie = "mr+nobody"

    queryURL = `http://www.omdbapi.com/?t=${movie}&y=&plot=short&apikey=${omdb}`
    axios.get(queryURL).then(
        function (response) {
            var movie = response.data
            console.log(
                `--------------------------------------------------------------
                
Title: ${movie.Title}
Year Released: ${movie.Year}
IMDB Rating: ${movie.Ratings[0].Value}
Rotten Tomatos Rating: ${movie.Ratings[0].Value}
Country Produced in: ${movie.Country}
Original Language: ${movie.Language}
Plot: ${movie.Plot}
Actors: ${movie.Actors}

--------------------------------------------------------------`
            )
        }
    )
}

var doWhatItSays = () => {
    fs.readFile("random.txt", "utf-8", function (err, data) {
        if (err) {
            return console.log(err)
        }
        var dataArr = data.split(",");
        command = dataArr[0];
        parameter = dataArr[1].trim().replace(/"/g, '');
        runApp();
        return;


    })
}

var pushLog = () => {
    if (commandLogged === false) {
        commandLogged = true;
        var commands = [];
        commands.push(command);
        if (parameter) {
            commands.push(parameter + '\r\n');
        } else commands[0] = (`${command},\r\n`)
        var logTextInput = commands.join(", ")
        fs.appendFile("log.txt", logTextInput, function (err) {
            if (err) {
                return console.log(err)
            }
        })
    } else {
        return;
    }

}

if (process.argv.length < 3) {

    inquirer.prompt([
        {
            type: "list",
            message: "What command would you like Liri to carry out?",
            choices: ["spotify-this-song", "movie-this", "concert-this", "do-what-it-says"],
            name: "command"
        },
        {
            type: "input",
            message: "Okay, now give the command a parameter. Ex: song name if you chose spotify-this-song or movie name for movie-this",
            name: "parameter"
        }
    ]).then(function (inquirerResponse) {
        command = inquirerResponse.command;
        parameter = inquirerResponse.parameter;
        runApp();
    })
} else {
    combineParameters()
    runApp();
}