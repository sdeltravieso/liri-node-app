require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var keys = require("./keys.js");
var fs = require('fs');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
var searchTerm = process.argv[3];

function liri() {

    switch (command) {
        case "my-tweets":
            getTweet()
            break;

        case "spotify-this-song":
            if (searchTerm) {
                getSpotify(searchTerm);
            } else {
                searchTerm = "The Sign ace of base"
                getSpotify(searchTerm);
            }
            break;

        case "movie-this":
            if (searchTerm) {
                getOMDB(searchTerm);
            } else {
                searchTerm = "Mr. Nobody"
                getOMDB(searchTerm);
            }
            break;

        case "do-what-it-says":
            doRandomThing();
            break;

        default:
            console.log("Please choose a valid option");

    }

    // function to get and display tweets.
    function getTweet() {
        var screenName = { screen_name: 'spencertravieso' };
        client.get('statuses/user_timeline', screenName, function (error, tweets, response) {
            if (!error) {
                console.log("");
                for (var i = 0; i < tweets.length; i++) {
                    var date = tweets[i].created_at;
                    console.log("@spencertravieso tweeted: \"" + tweets[i].text + "\" on " + date.substring(0, 19));
                }
                console.log("");
                // console.log(JSON.stringify(tweets, null, 2));
            }
        })
    }

    function getSpotify(searchSong) {
        spotify.search({ type: 'track', query: searchSong, limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            // console.log(data); 
            for (var i = 0; i < data.tracks.items.length; i++) {
                console.log("");
                console.log("Artist: " + data.tracks.items[i].artists[i].name);
                console.log("Song: " + data.tracks.items[i].name);
                console.log("Link to Song: " + data.tracks.items[i].artists[i].external_urls.spotify);
                console.log("Album: " + data.tracks.items[i].album.name);
                console.log("");

                // console.log(JSON.stringify(data, null, 2));
                // console.log("-----------------------------------------------------------------------")
            }
        });
    }

    function getOMDB(searchMovie) {
        // var movie = "Mr. Nobody";
        var queryURL = "https://www.omdbapi.com/?t=" + searchMovie + "&y=&plot=short&tomatoes=true&apikey=trilogy";

        request(queryURL, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var body = JSON.parse(body);
                console.log("");
                console.log("Title: " + body.Title);
                console.log("Year Released:  " + body.Year);
                console.log("IMDB Rating: " + body.imdbRating);
                // console.log("Rotten Tomatoes Rating: " + body.Ratings);
                console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
                console.log("Country(s) of Production: " + body.Country);
                console.log("Language(s): " + body.Language);
                console.log("Plot: " + body.Plot);
                console.log("Actors: " + body.Actors);
                console.log("");
                // console.log(JSON.stringify(body, null, 2));
                // console.log('body:', body); // Print the HTML for the Google homepage.

            } else {

                console.log('error:', error); // Print the error if one occurred
            }
            // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        });
    }

    function doRandomThing() {
        fs.readFile("random.txt", "utf8", function (err, data) {
            if (err) {
                return console.log(err);
            }

            var data = data.split(",");

            command = data[0];
            searchTerm = data[1];
            liri();
        })
    }
}

liri();