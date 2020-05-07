const dotenv = require("dotenv").config();
const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) => console.log("Something went wrong when retrieving an access token", error));

const app = express();

// Set view engine paths
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

/////////////////////////////////////////

// Our routes go here:
app.get("/", (request, response) => {
  response.render("index");
});

//artist data route handler
app.get("/artist-search/", (request, response) => {
  const id = request.query.id;
  spotifyApi
    .searchArtists("id")
    //ISSUE: RECEIVING SAME ARTISTS DESPITE DIFFERENT SEARCH QUERY
    .then((artistData) => {
      const data = artistData.body.artists.items;
      console.log("The received artist data from the API: ", data);
      response.render("artist-search", { results: data });
    })
    .catch((err) => console.log("The error while searching artists occurred: ", err));
});

//album data route handler
app.get("/albums/:id", (request, response) => {
  const id = request.params.id;
  spotifyApi
    .getArtistAlbums(id)
    .then((albumData) => {
      const data = albumData.body.items;
      console.log("The received album data from the API: ", data);
      response.render("albums", { results: data });
    })
    .catch((err) => console.log("The error while searching albums occurred: ", err));
});

//track data route handler
app.get("/tracks/:id", (request, response) => {
  const id = request.params.id;
  spotifyApi
    .getAlbumTracks(id)
    .then((tracksData) => {
      const data = tracksData.body.items;
      console.log("The received tracks data from the API: ", data);
      response.render("tracks", { results: data });
    })
    .catch((err) => console.log("The error while searching tracks occurred: ", err));
});

/////////////////////////////////////////

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
