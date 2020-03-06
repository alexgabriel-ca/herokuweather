const request = require("request");

var getWeather = (latitude, longitude, callback) => {
	request({
		url: `https://api.forecast.io/forecast/5f8d0e6ecb635a4e8bfbdc01b27105bf/${latitude},${longitude}?units=si`,
		json: true
	}, (error, response, body) => {
		if (error) {
			callback("Unable to connect to the weather server.");
		} else if (response.statusCode === 400) {
			callback("Unable to connect to the weather server.");
		} else if (response.statusCode === 200) {
			callback(undefined, {
				temperature: body.currently.temperature,
				apparentTemperature: body.currently.apparentTemperature,
				precipitation: body.currently.precipProbability,
				conditions: body.currently.summary,
				windSpeed: body.currently.windSpeed,
				windGusts: body.currently.windGust
			})
		}
	});
};
module.exports.getWeather = getWeather;