/* Server wide constants. */
const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geoCode = require("./assets/resources/geocode");
const weather = require("./assets/resources/weather");

/* Application specific constants. */
const assetsDirectory = path.join(__dirname, "assets");
const cssDirectory = path.join(assetsDirectory, "css");
const htmlDirectory = path.join(assetsDirectory, "html");
const imgDirectory = path.join(assetsDirectory, "images");
const partialsPath = path.join(assetsDirectory, "templates/partials");
const viewsPath = path.join(assetsDirectory, "templates/views");
const port = process.env.PORT || 3000;

/* Server variables and directives. */
var app = express();
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

/* Static content directories. */
app.use(express.static(assetsDirectory));
app.use(express.static(imgDirectory));

/* Create server and start listening. */
app.listen(port);

/* Server routes to handle specific page requests. */
app.get("", (req, res) => {
	/* Render index view found in assets/views directory using JSON data. */
	res.render("index", {
		title: "Index",
		message: "Use the form below to grab a basic weather forecast."
	});
});

app.get("/about", (req, res) => {
	/* Render about view found in assets/views directory using JSON data. */
	res.render("about", {
		title: "About Me Page",
		message1: "I'm a developer of many languages, most of which are web based.",
		message2: "Studied computer programming in college where I learned Assembler, C/C++, C/Windows, Clipper, dBASE III Plus, Visual Basic, and Visual C++",
		message3: "Since then I have branched out to include ASP.NET, Bash Shell, ColdFusion, Cscript, HTML5, JavaScript, Java SE, MySQL, Node.js, PHP, PowerShell, and SQL plus BootStrap, CSS, jQuery, and other languages to my repertiore.",
	});
});

app.get("/help", (req, res) => {
	/* Render help view found in assets/views directory using JSON data. */
	res.render("help", {
		title: "FAQ",
		message1: "This app is fairly simple, and provides a weather lookup service.  Simply enter all or part of an address in the field, and it will return weather information for the information given.",
		message2: "When entering partial information, lack of accuracy in forecast results has been noted due to the fact multiple locations may be identified by the partial information.  I.e. A postal code of '08001' is more specific (and will return better results) than an entry such as 'Barcelona'.  Units are provided in Metric."
	});
});

app.get("/weather", (req, res) => {
	/* Render weather view found in assets/views directory using JSON data. */
	var address = req.query.address.replace(/\W/g, ' ');
	if (!address) {
		res.render("weather", {
			message: "Address, city, region, country, or postal/zip code for weather report is required."
		});
	} else {
		geoCode.geoCodeAddress(address, (error, {latitude, longitude, location} = {}) => {
			if (error) {
				res.render("weather", {
					message: "Weather forecast not found."
				});
			} else {
				weather.getWeather(latitude, longitude, (error, forecastData) => {
					if (error) {
						res.render("weather", {
							message: "Weather forecast not found"
						});
					} else {
						if (!forecastData.temperature) {
							forecastData.temperature === 0;
						} else {
							var temperature = forecastData.temperature;
						}

						if (!forecastData.apparentTemperature) {
							forecastData.apparentTemperature === 0;
						} else {
							var apparentTemperature = forecastData.apparentTemperature;
						}

						if (!forecastData.windSpeed) {
							forecastData.windSpeed === 0;
						} else {
							var windSpeed = forecastData.windSpeed;
						}

						if (!forecastData.windGusts) {
							forecastData.windGusts === 0;
						} else {
							var windGusts = forecastData.windGusts;
						}
						res.render("weather", {
							weatherLocation: `Weather forecast for ${address}:`,
							message: `The temperature is ${temperature} C, and feels like ${apparentTemperature} C.  We have wind speed expected at ${windSpeed} km/h with gusts up to ${windGusts} km/h.`
						});
						if (!req.query.address) {
							res.render("weather", {
								message: "Invalid location entered, providing you the weather in sunny Beverly Hills, California."
							});

						}
					}
				});
		}
		});
	}
});

app.get("*", (req, res) => {
	/* Render weather view found in assets/views directory using JSON data. */
	res.render("404", {
		title: "File Not Found",
		message: "Unfortunately, the page you requested cannot be found."
	});
});