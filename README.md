# liri-node-app

## Description

Liri is an application that is run in the terminal that utilizes javascript and node.js. The purpose of liri is to take user imput through the terminal, access one of three different APIs via different axios calls and console logging specific information for the user to see. Users searching movies access the OMDB API to garner a specific movie's title, plot, the actors starring in it, how well the movie was rated and the release date. Users can search for bands and artists that are touring in order to find concert information. Specifically the venue, location and the date the concerts will be taking place. Users searching specific songs will get the title, album it was released on, artist(s) performing and a link to a preview of the song. Liri also is able to read and write. Liri reads the file <random.txt> and takes the arguments from that page to out put information. Liri will also write every command the user inputs as into the <log.txt> file. Liri also can be run without any arguments in the command line, but by simply running the file with "node liri" in the command prompt. This will bring up a prompt asking the user which command they would like to give Liri and to give a parameter (song name, movie name, read from the text file for a command or artist name). 

## Prerequisites

1. Valid API keys for the bands in town API and OMDB API. Users will also need to make a developer account with spotify in order to receive a special API key and secret. Spotify must receive these two pieces of information on each axios call in order for the user to be validated to use their database. 
2. The Node modules used for this project are as follows: node-spotify-api, axios, moment, dotenv and inquirer. These and all of their dependencies will need to be installed before Liri will become operational.

## Under the Hood

As stated before, in order to get Liri working there needs to be valid application identification for the different APIs. However, in order to get these functioning without exposing them to the public dotenv is neccessary. Dotenv is a zero dependency module that loads environment variables from a .env file. Essentially, dotenv reads the API keys in the .env file, and saves them gets referred to them by the keys.js file. This is so the public cannot use or see the author's API keys and is an extra layer of protection.

When Liri is run, the path the logic can take is split in two by a conditional function. This function reads if Liri is being read with any arguments or not. If Liri is not being run with any arguments, the prompt appears. This prompt is only able to be run with the help of the node module inquirer. If Liri is being run with arguments, then the runApp function is being called. The runAPP function is the meat of the application. It is a switch statement that based on the different arguments being given runs a different function. For example, if the user puts into the command line <node liri spotify-this-song born to be wild> Liri will run the function that commits an axios call to the spotify API. However, before this happens the user input must by parsed and put into the correct format in order to plug into the different query URLs depending on which API is being called. First, a for loop is being run in order to take the arguments starting at process.argv[3] until the end. They are pushed into an array, then joined in order to become a string and either have "%20" between them or "+" in order to make the axios call correctly formatted. A problem occurred when first developing the Liri app. Originally the for loop that took arguments was coded inside the functions making the axios call, but when no arguments were given and the user was typing in the parameters into the prompts, it was already being saved as a string instead of indexes in an array, so this was unneccessary and made this bit of code not work correctly. In order to fix this, the for loop was declared as its own function to be ran when neccessary. 
  
The concert-this command is no different in execution than the other two commands, however when the data is received the node module moment is being run in order to take the time stamp and convert it into the "MMMM DD YYYY" format in order to make it more readable. 
  
In order to get Liri to be able to read and write Liri needed to be able to work with the file system of the computer that it is being run on. This, like all over node modules, was done using the require function. Another interesting problem to be solved during the creation of the Liri application was having Liri append the commands onto the log.text file. Not too difficult, but when the command do-what-this-says is run, Liri reads the information on the random.txt file and goes to work. However, originally this was logging multiple commands into the log even though the user only typed in one command. In order to work around this, the function for writing the log had to be put into a conditional inside each command function that is reading the boolean value of a variable called commandLogged. CommandLogged has a default value of false. In order for a command to be logged, this value must be false. Therefore, all command functions will be written when called, however at the end of the do-what-this-says function the value of commandLogged is changed to true. This makes it impossible for the other function that is about to be run to log the command into the command.txt file.

### Built With

* javascript
* node.js
* node-spotify-api
* axios
* moment
* dotenv
* inquirer
* Bands in town API
* OMDB API

### Authors

* Charles Danner - https://github.com/charlesdanner
