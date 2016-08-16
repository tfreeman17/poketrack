var express = require("express");

var app = express();

var PORT = process.env.PORT || 8000;

var Sighting = require("./Sightings.js");
var bodyParser = require('body-parser');
var session = require('express-session');

var sightings = [];

function oldSightings(arr){
return arr.timestamp > (Date.now() - 6000000);
}
setInterval(function(){
	sightings = sightings.filter(oldSightings);
},	60000);

var UserFtns = require("./UserFtns.js");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(session({
	secret: "lol pokemon",
	resave: false,
	saveUninitialized: false
}));

app.get("/json/sightings", function(req, res) {
	//check if user is logged in
	if (!req.session.user) {
		res.send('error - not logged in');
		return;
	}
	// send the entire sightings list, as a string
	res.send(JSON.stringify(sightings));
});

app.post("/json/sightings/id/:pokemonId", function(req, res) {
	if (!req.session.user) {
		res.send('error - not logged in');
		return;
	}
	res.send( //send to the user
		JSON.stringify( // a string representing
			sightings //all of the sightings
			.filter( //which match the following
				function(loc) { //that
					return loc.pokemonId == req.params.pokemonId; //the ids match
				}
			)
		)
	);
});
	// Same as above, but with a filter on city name (loc string)

app.get("/json/sightings/city/:cityName", function(req, res) {
	//check if user is logged in
	if (!req.session.user) {
		res.send('error - not logged in');
		return;
	}
	// send any sightings that match the pokemon id
	res.send(JSON.stringify(sightings.filter(function(loc) {
		return loc.locStr == req.params.cityName;
	})));
});



app.post("/json/sightings", function(req, res) {
	// Check if the user is logged in
	if (!req.session.user) {
		res.send('error - not logged in ');
		return;
	}
	// Create our new Sighting object using the Sighting constructor function
	// (now we have a new sighting object) and store it in our super fancy
	// database (the sightings array)
	var newLoc = new Sighting(
		req.body.locStr,
		req.body.pokemonId,
		Date.now(),
		req.session.user);
	sightings.push(newLoc);

	//Tell the frontend that the request was successful
	res.send("success");
});

app.get('/api/login', function(req, res){
	res.sendFile(__dirname + "/public/index.html");
});

app.get('/api/logout', function(req, res){
	req.session.user = "";
	res.send("success");
});

app.post('/api/login', function(req, res){
	if (UserFtns.checkLogin(req.body.username, req.body.password)) {
		// if the user logs in, we set the session
		// variable for future requests (now the user is
		// logged in)
		// and then we say that the request was a success
		req.session.user = req.body.username;
		res.send("success");
	} else {
		// If something went wrong, we just say "error"
		res.send("error");
	}
});


app.get('/map(.html)?', function(req,res) {
	if (!req.session.user) {
		res.redirect("/login");
		return;
	}
	res.sendFile(__dirname + "/public/map.html");
});


app.post('/api/register', function(req, res){
	//shorthand variables to save us time
	var username = req.body.username;
	var password = req.body.password;
	if (UserFtns.userExists(username)) {
		// If the username already exists
		if (UserFtns.checkLogin(username, password)) {
			// ... and they have the right password
			// then log the user in
			req.session.user = username;
			// Send "success" so that the frontend knows
			// it is ok to redirect to /map
			res.send("success");
		} else {
			// Otherwise, they might be trying to
			// take a username that already exists - error!
			res.send("error");
		}
	} else {
		// Username is not taken, register a new user
		// and log them in - success!
		if(UserFtns.registerUser(username, password)) {
			req.session.user = username;
			// Send "success" so that the frontend knows
			// it is ok to redirect to /map
			res.send("success");
		} else {
			// there was a problem registering
			res.send("error");
		}
	}
});

app.use(express.static("public"));

app.use(function(req, res, next) {
	res.status(404);
	res.send("It's not very effective");
});

app.listen(PORT, function() {
	console.log("Gotta catch 'em all on port " + PORT);
});
