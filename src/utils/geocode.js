const request = require('request');

const geocode = (address, callback) => {
	const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/'${encodeURIComponent(address)}.json?access_token=pk.eyJ1Ijoia29rb2JveSIsImEiOiJja3hvYWtqZGQ3cGxlMnVybmlvMzMybWg5In0.8FjBCn9yDSwNjT2RTHewOg`;

	request({ url, json: true }, (error, { body }) => {
		if (error) {
			callback('Unable to get location at this time!');
		} else if (body.features.length === 0) {
			callback('Inaccurate location!');
		} else {
			callback(undefined, {
				latitude: body.features[0].center[1],
				longitude: body.features[0].center[0],
				location: body.features[0].place_name,
			});
		}
	});
};

module.exports = geocode;
