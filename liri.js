require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api')
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require('moment');

//user inputs
var userChoice = process.argv[2];
var userInput = process.argv[3];

userInputs(userChoice, userInput);

function userInputs(userChoice, userInput) {
    //console.log(userChoice + userInput)
    switch(userChoice) {
    case 'concert-this':
        displayConcerts(userInput);
        break;
    case 'spotify-this-song':
        displaySongs(userInput);
        break;
    case 'movie-this':
        displayMovies(userInput);
        break;
    case 'do-what-it-says':
        displayInfo();
        break;
    default:
        console.log("Error: Try typing... \nconcert-this \nspotify-this-song \nmovie-this \ndo-what-it-says")
    }
}

//SPOTIFY
function displaySongs(userInput) {
    if(userInput === undefined) {
        userInput = "The Sign";
    }
    spotify.search(
        {
            type: "track",
            query: userInput,
        },
        function (err, data) {
            if(err) {
                console.log("Error: " + err);
                return;
            }
        var songs = data.tracks.items;

        for(var i = 0; i < songs.length; i++) {
            console.log("SONG INFO");
            console.log(i);
            console.log("Song name: " + songs[i].name);
            console.log("Preview: " + songs[i].preview_url);
            console.log("Album: " + songs[i].album.name);
            console.log("Artist: " + songs[i].artists[0].name);
        }
        }

    );
}

//BANDS IN TOWN
function displayConcerts(userInput) {
    var queryURL = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp"
    axios.get(queryURL).then(
        function(response) {
            let concerts = response.data;
            for (var i = 0; i < concerts.length; i++) {
                let concertDate = concerts[i].datetime;
                
                console.log("--CONCERT INFO--");
                console.log(i);
                console.log("Name of Venue: " + concerts[i].venue.name);
                console.log("Venue Location: " + concerts[i].venue.city);
                console.log("Concert Date: " + moment(concertDate, "YYYY-MM-DD, HH:mm:ss").format("MM/DD/YYYY"));
            }
        }
    ) 
    
}

//OMBD
function displayMovies(userInput){
    if(userInput === undefined) {
        userInput = "Mr.Nobody"
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/" +"\n");
    } 
    var queryURL = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=e1d330ed"
    axios.get(queryURL).then(
        function(response){
            let movies = response.data;
            console.log("--MOVIE INFO--");
            console.log("Title: " + movies.Title);
            console.log("Release Year: " + movies.Year);
            console.log("IMDB Rating: " + movies.imdbRating);
            console.log("Rotten Tomatoes Rating: " + RottenTomatoesRatingVal(movies));
            console.log("Country of Production: " + movies.Country);
            console.log("Plot: " + movies.Plot);
            console.log("Actors: " + movies.Actors);
        }
    )
}

function rottenTomatoesObj(data) {
    return data.Ratings.find(function(item) {
       return item.Source === "Rotten Tomatoes";
    });
  }
  
  function RottenTomatoesRatingVal(data) {
    return rottenTomatoesObj(data).Value;
  }

  function displayInfo(){
      fs.readFile('random.txt', 'utf8', function(err, data){
          if(err){
              console.log(err);
          }
          var dataArr = data.split(',');
          userInputs(dataArr[0], dataArr[2]);
      })
  }