
let cli = () => {            //container to keep things out of global scope


    require("dotenv").config();         //file containing API keys

    const Spotify = require('node-spotify-api');
    const keys = require("./keys.js");
    const axios = require("axios");    //constant variables. Requiring node modules/ local files
    const moment = require("moment");
    const fs = require("fs");
    const spotify = new Spotify(keys.spotify);
    const bandsInTown = keys.bandsInTown.id;        //apis are handled by accessing the keys doc. It, in turn, accesses the .env file where the api keys are located.
    const omdb = keys.omdb.id;
    const inquirer = require("inquirer");

    let command = process.argv[2];
    let parameter = process.argv.slice(3).join(" ") || null;                             //important functions that are populated by terminal arguments made
    let commandLogged = false;                    //variable for not allowing loops to happen more than once.


    let executeFlow = () => {

        //function called when argument concert-this is inputed into terminal
        let concertThis = () => {
            let artist = parameter;        //artist is equal to the command given
            let urlArtist = artist.split(' ').join('%20');  //if the artist has a space in the name its replaced by %20 for a legitimate url
            urlArtist.replace('"', '');
            queryURL = `https://rest.bandsintown.com/artists/${urlArtist}/events?${bandsInTown}`        //query parsed together by urlArtist variable and api key in separate file
            axios.get(queryURL).then(
                response => {
                    for (var i = 0; i < response.data.length; i++) {        //for loop going through the response data
                        let date = moment(response.data[i].datetime)  //variable date is assigned to moment parsing through the time stamp given in data
                        console.log( //console logging relevant data to the terminal for the user 
                            //event date is formatted correctly using moment

                            `--------------------------------------------------------------

Concert venue name: ${response.data[i].venue.name}
Location:           ${response.data[i].venue.city}, ${response.data[i].venue.country} 
Event date:         ${date.format("MMMM DD YYYY")}

--------------------------------------------------------------
`
                        )
                    }
                },

                error => {
                    if (error.response) {

                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);                                //various error messages that pop up based on how the axios call messed up
                    } else if (error.request) {

                        console.log(error.request);
                    } else {

                        console.log("Error", error.message);
                    }
                    console.log(error.config);
                }
            )
        }

        let spotifyThisSong = () => {
            let songTitle;
            let artist;
            let album;
            let song;                //variables being populated by results
            let preview;
            if (parameter) {
                songTitle = parameter;
            } else songTitle = "the sign";

            spotify.search({ type: 'track', query: songTitle })
                .then(response => {

                    if (parameter) {
                        artist = response.tracks.items[0].album.artists[0].name;  //grabbing the first song return from spotify's api
                        album = response.tracks.items[0].album.name;
                        song = response.tracks.items[0].name;
                        preview = response.tracks.items[0].preview_url;
                    } else {
                        for (var i = 0; i < response.tracks.items.length; i++) {
                            if ((response.tracks.items[i].album.artists[0].name === "Ace of Base") && (response.tracks.items[i].name === "The Sign")) {
                                artist = (response.tracks.items[i].album.artists[0].name);
                                album = response.tracks.items[i].album.name;         //for loop to ensure that the song grabbed is Ace of Base's The Sign.
                                song = response.tracks.items[i].name;
                                preview = response.tracks.items[i].preview_url;
                            }
                        }
                    }
                    console.log(
                        `--------------------------------------------------------------

Artist:                     ${artist}
From the album:             ${album}
Song title:                 ${song}
Link to a preview of song:  ${preview}

--------------------------------------------------------------`
                    )
                })
                .catch(err => console.log(err));

        }

        let movieThis = () => {
            let movie;
            if (parameter) {                                //giving a declared variable a value based on whether search parameters were given or not
                movie = parameter.split(" ").join("+");
            } else movie = "mr+nobody";

            queryURL = `http://www.omdbapi.com/?t=${movie}&y=&plot=short&apikey=${omdb}`
            axios.get(queryURL).then(
                response => {
                    let movie = response.data;
                    console.log(
                        `--------------------------------------------------------------
                
Title:                  ${movie.Title}
Year Released:          ${movie.Year}
IMDB Rating:            ${movie.Ratings[0].Value}
Rotten Tomatos Rating:  ${movie.Ratings[0].Value}
Country Produced in:    ${movie.Country}
Original Language:      ${movie.Language}
Plot:                   ${movie.Plot}
Actors:                 ${movie.Actors}

--------------------------------------------------------------`
                    )
                }
            )
        }

        let doWhatItSays = () => {
            fs.readFile("random.txt", "utf-8", (err, data) => {   //when do-what-it-says is the command, the fs is referenced to call for the ability to read and write.
                if (err) {
                    return console.log(err)
                }
                let dataArr = data.split(",");
                command = dataArr[0];                   //takes the data received from random.txt, seperates it and gains the command and search parameters from that
                parameter = dataArr[1].trim().replace(/"/g, '');
                executeFlow();
                return;


            })
        }

        let pushLog = () => {
            if (commandLogged === false) {
                commandLogged = true;
                let commands = [];
                commands.push(command);                 //function that pushes the commands that the user input into the log. this only works if !commandLogged
                if (parameter) {
                    commands.push(parameter + '\r\n');
                } else commands[0] = (`${command},\r\n`);
                let logTextInput = commands.join(", ");
                fs.appendFile("log.txt", logTextInput, err => {
                    if (err) {
                        return console.log(err);
                    }
                })
            } else {
                return;
            }

        }


        switch (command) {
            case "concert-this":
                concertThis()               //if argv[2] is equal to these cases the corresponding function is called
                pushLog()                   //each have a function that fires off to push the command to the logs if the commandLogged boolean is false
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

    if (process.argv.length < 3) {          //if the command line does not contain any arguments,

        inquirer.prompt([                   //these prompts will come up for the user to select which what kind of search liri needs to do
            {                                   //then a message to input their search item in to type these inputs will be saved and 
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
        ]).then(inquirerResponse => {
            command = inquirerResponse.command;         //after responses are logged, variables logging the search parameters are stored as the user inputs
            parameter = inquirerResponse.parameter;
            executeFlow();                              //the switch case running the parameters is started and the axios call is about to happen 
        })
    } else executeFlow();                          //if there are search parameters, skip to the flow
    
}

cli()                          //container executes

