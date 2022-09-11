const request = require('request');

const forecast = (latitude, longitude, callback) => {
	const url = `http://api.weatherstack.com/current?access_key=ff8269c5b0bd46ba6e40cce113c0e3e8&query=${latitude}, ${longitude}&units=f`;

	request({ url, json: true }, (error, { body }) => {
		if (error) {
			callback('Unable to connect to weather service!');
		} else if (body.error) {
			callback('Inaccurate location!');
		} else {
			const current = body.current;

			callback(undefined, `${current.weather_descriptions} ${current.temperature}℉ , feels like ${current.feelslike}℉. Humidity ${current.humidity}%. ${current.wind_speed} mph, '${current.wind_dir}' wind direction.`);
		}
	});
};

module.exports = forecast;
