var keys = require("./keys.js");
var request = require("request");
require("dotenv").config();

var fs = require("file-system");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");

var liriCommand = process.argv[2];

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

console.log(`this is ${client}`);
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

var spotify = new Spotify({
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
});

spotify.getSong = function() {
  console.log("got into");
  spotify.search({ type: "track", limit: 1, query: process.argv[3] }, function(
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

var pick = function(caseData, functionData) {
  switch (liriCommand) {
    case "my-tweets":
      getTweets();
      console.log("here are your tweets");
      break;
    case "spotify-this-song":
      spotify.getSong();
      console.log("Play this song");
      break;
    case "movie-this":
      noMovie();
      break;
    case "do-what-it-says":
      noCommand();
      break;
    default:
      console.log("LIRI DOES NOT KNOW THAT");
  }
};

var movieThis = function() {
  request(
    "http://www.omdbapi.com/?apikey=trilogy&t=" + process.argv[3],
    function(error, response, body) {
      console.log("Title: " + JSON.parse(body).Title);
      console.log("Year: " + JSON.parse(body).Year);
      console.log("Rating: " + JSON.parse(body).Rated);
      console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[0].Value);
      console.log("Country Produced: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
    }
  );
};

var noMovie = function() {
  if (process.argv[3] !== "") {
    process.argv[3] = "Mr. Nobody";
    movieThis();
  } else {
    movieThis();
  }
};

var noCommand = function() {
  fs.readFile("random.txt", "UTF8", function(err, data) {
    if (err) {
      return console.log(err);
    }
    process.argv[3] = data;
    console.log(data);
    console.log("PROCESS: " + process.argv[3]);
    spotify.getSong();
  });
};

var runThis = function(argOne, argTwo) {
  pick(argOne, argTwo);
};
runThis(process.argv[2], process.argv[3]);
