const request = require("request");

var geoCodeAddress = (address, callback) => {
	var encodedAddress = encodeURI(address);
	request({
		//Send query to MapQuest API
		url: `http://www.mapquestapi.com/geocoding/v1/address?key=dRJAA6WB2fOZpkdtdbFw6TeQChE2F23x&location=${encodedAddress}`,
		json: true
	}, (error, response, body) => {
		if (error) {
			callback("Cannot connect to the MapQuest server.  Please try again later.");
			process.exit(1);
		} else {
			//Check for valid response from MapQuest by checking whether latitude and longitude have values.
			if (body.results[0].locations[0].latLng.lat !== "" && body.results[0].locations[0].latLng.lng !== "") {
				callback(undefined, {
					address: body.results[0].locations[0].street,
					city: body.results[0].locations[0].adminArea5,
					province: body.results[0].locations[0].adminArea3,
					country: body.results[0].locations[0].adminArea1,
					latitude: body.results[0].locations[0].latLng.lat,
					longitude: body.results[0].locations[0].latLng.lng
				});
			} else {
				callback("Invalid address information provided.  Check your input and try again.");
				process.exit(1);
			}
		}
	}, 0);
};

module.exports.geoCodeAddress = geoCodeAddress;