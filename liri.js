// requiring packages needed for liri.js
var keys = require("./keys.js");
var request = require("request");
require("dotenv").config();
var fs = require("file-system");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");

//TWITTER ===============
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
        console.log("-------------");
      }
    } else {
      console.log(error);
    }
  });
};
//SPOTIFY ==================
var spotify = new Spotify({
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
});

// function for retrieving song from spotify
spotify.getSong = function(songName) {
  console.log(songName);
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

//OMDB =============
//function for retrieving information from OMDB
var movieThis = function(movie) {
  request("http://www.omdbapi.com/?apikey=trilogy&t=" + movie, function(
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
// if no movie is provided
var noMovie = function(movie) {
  if (movie === "") {
    movie = "Mr. Nobody";
  }
  movieThis(movie);
};

//function for do-what-it-says command
var doIt = function() {
  fs.readFile("random.txt", "UTF8", function(err, data) {
    if (err) {
      return console.log(err);
    }

    // Data from file is in <cmd>,<song-or-movie>

    var ranArr = data.split(","); // ['movie-this', '"Planes', ' Trains & Autmobiles"']
    var cmd = ranArr[0]; // 'movie-this'
    var val = data.replace(cmd + ",", "");

    runCommand(cmd, val);
  });
};

//switch statement for commands given
var runCommand = function(command, value) {
  switch (command) {
    case "my-tweets":
      getTweets();
      break;
    case "spotify-this-song":
      spotify.getSong(value);
      break;
    case "movie-this":
      noMovie(value);
      break;
    case "do-what-it-says":
      doIt();
      break;
    default:
      console.log("LIRI DOES NOT KNOW THAT");
  }
};

runCommand(process.argv[2], process.argv[3]);
