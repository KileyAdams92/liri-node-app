// requiring packages needed for liri.js
var keys = require("./keys.js");
var request = require("request");
require("dotenv").config();
var fs = require("file-system");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");

var instruction = process.argv[3];

//logging command and user history
var liriCommand = process.argv[2];
function logging() {
  var log = "log.txt";
  fs.appendFile(log, liriCommand + ": " + instruction + ". \n", function(err) {
    if (err) {
      console.log(err);
    }
  });
}

//TWITTER ---------------------------
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// function for retrieving tweets
var getTweets = function() {
  var params = { screen_name: "KAdams48235137" };
  client.get("statuses/user_timeline", params, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      for (var i = 0; i < 20; i++) {
        console.log(tweets[i].created_at);
        console.log(tweets[i].text);
        console.log("--------------------------------------");
      }
    } else {
      console.log(error);
    }
  });
};
//SPOTIFY --------------------------
var spotify = new Spotify({
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
});

// if no song is provided
var noSong = function(instruction) {
  if (instruction === undefined) {
    instruction = "The Sign";
  }
  console.log(instruction);
  spotify.getSong(instruction);
};

// function for retrieving song from spotify
spotify.getSong = function(songName) {
  spotify.search({ type: "track", limit: 1, query: songName }, function(
    err,
    data
  ) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
    console.log(
      "Song preview: " +
        data.tracks.items[0].album.artists[0].external_urls.spotify
    );
    console.log("Album name: " + data.tracks.items[0].album.name);
    console.log("Song title: " + data.tracks.items[0].name);
  });
};

//OMDB -----------------
//function for retrieving information from OMDB
var movieThis = function() {
  if (instruction == undefined) {
    instruction = "Mr. Nobody";
  }
  request("http://www.omdbapi.com/?apikey=trilogy&t=" + instruction, function(
    error,
    response,
    body
  ) {
    if (error) {
      return console.log(error);
    } else if (response.statusCode !== 200) {
      return console.log("Error: returned " + response.statusCode);
    }

    var data = JSON.parse(body);

    if (data.Error) {
      return console.log(data.Error);
    }

    console.log("Title: " + data.Title);
    console.log("Year: " + data.Year);
    console.log("Rating: " + data.Rated);
    console.log("Rotten Tomatoes: " + data.Ratings[0].Value);
    console.log("Country Produced: " + data.Country);
    console.log("Language: " + data.Language);
    console.log("Plot: " + data.Plot);
    console.log("Actors: " + data.Actors);
  });
};

//function for do-what-it-says command
var doIt = function() {
  fs.readFile("random.txt", "UTF8", function(err, data) {
    if (err) {
      return console.log(err);
    }
    // Data from file is in <cmd>,<song-or-movie>

    var ranArr = data.split(",");
    var cmd = ranArr[0];
    var val = data.replace(cmd + ",", "");

    runCommand(cmd, val);
  });
};

//switch statement for commands given
var runCommand = function(command, value) {
  switch (command) {
    case "my-tweets":
      getTweets();
      logging();
      break;
    case "spotify-this-song":
      noSong(value);
      logging();
      break;
    case "movie-this":
      movieThis(value);
      logging();
      break;
    case "do-what-it-says":
      doIt();
      logging();
      break;
    default:
      console.log("LIRI DOES NOT KNOW THAT");
  }
};

runCommand(process.argv[2], process.argv[3]);
