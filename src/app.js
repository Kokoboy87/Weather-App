// Load the libraries
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const https = require('https')
require('dotenv').config()

// Store the express application
const app = express()
// Conect the project with Heroku
const port = process.env.PORT || 3000
// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup a static directory to serve
app.use(express.static(publicDirectoryPath))

// Method to navigate to the home page route
app.get('', (req, res) => {
	// rendering dynamic content
	res.render('index', {
		title: 'Weather ☀',
		name: 'Georgios Kokotinis',
	})
})
// Method to navigate to the about page route
app.get('/about', (req, res) => {
	res.render('about', {
		title: 'About 🌤',
		name: 'Georgios Kokotinis',
	})
})
// Method to navigate to the help page route
app.get('/help', (req, res) => {
	res.render('help', {
		titleText: 'Work in progress',
		title: 'Help 🌧',
		name: 'Georgios Kokotinis',
	})
})
// Method to navigate to the weather page route
app.get('/weather', (req, res) => {
	if (!req.query.address) {
		return res.send({
			error: 'Address must be provided',
		})
	}
	// Call the geocode function. // callback function to fetch the latitude, longitude, and location
	geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
		if (error) {
			// Shorthand error message
			return res.send({ error })
		}
		// Call the forecast function
		forecast(latitude, longitude, (error, forecastData) => {
			if (error) {
				return res.send({ error })
			}
			//sending back the object
			res.send({
				forecast: forecastData,
				location,
				address: req.query.address,
			})
		})
	})
})

app.get('/products', (req, res) => {
	if (!req.query.search) {
		return res.send({
			error: 'You must provide a search term',
		})
	}
	console.log(req.query.search)
	res.send({
		products: [],
	})
})

app.get('/help/*', (req, res) => {
	res.render('404', {
		title: '404',
		name: 'Georgios Kokotinis',
		errorMessage: 'Help article not found',
	})
})

app.get('/background', (req, res) => {
	const city = req.query.city || 'weather'
	const accessKey = process.env.UNSPLASH_ACCESS_KEY

	if (!accessKey) {
		return res.status(500).send({ error: 'Unsplash access key is missing' })
	}

	const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(city + ' city skyline landscape')}&orientation=landscape&per_page=1&client_id=${accessKey}&fm=webp&fit=max&w=1600&q=80`

	const https = require('https')

	https
		.get(url, (apiRes) => {
			let data = ''

			apiRes.on('data', (chunk) => {
				data += chunk
			})

			apiRes.on('end', () => {
				try {
					const json = JSON.parse(data)
					const results = json.results

					if (!results || results.length === 0 || !results[0].urls?.full) {
						return res.status(404).send({ error: 'No image found for this location' })
					}

					const imageUrl = results[0].urls.full
					res.send({ url: imageUrl })
				} catch (err) {
					console.error('Parse error:', err)
					res.status(500).send({ error: 'Failed to parse image data' })
				}
			})
		})
		.on('error', (err) => {
			console.error('Request error:', err)
			res.status(500).send({ error: 'Image fetch failed' })
		})
})

// Method to navigate to the 404 page route
app.get('*', (req, res) => {
	res.render('404', {
		title: '404',
		name: 'Georgios Kokotinis',
		errorMessage: 'Page not found',
	})
})

// Method that starts the server
app.listen(port, () => {
	console.log(`Server is up on port ${port}`)
})
