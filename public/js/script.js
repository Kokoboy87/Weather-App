console.log('Weather App')

const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#messageLocation')
const messageTwo = document.querySelector('#messageError')

//Function to fetch and set background image
// This function fetches a random image from Unsplash based on the provided query
const setBackgroundImage = async (cityName) => {
	const bg = document.getElementById('bg-image-layer')
	if (!bg) {
		console.warn('Background image layer not found.')
		return
	}

	// Apply initial blur while loading
	bg.style.filter = 'blur(8px)'
	bg.style.transition = 'filter 0.5s ease'

	try {
		const response = await fetch(`/background?city=${encodeURIComponent(cityName)}`)
		const data = await response.json()

		if (data.url) {
			const img = new Image()
			img.src = data.url

			img.onload = () => {
				// When image is ready, apply it and unblur
				bg.style.backgroundImage = `url(${data.url})`
				bg.style.backgroundSize = 'cover'
				bg.style.backgroundPosition = 'center'
				bg.style.filter = 'blur(0)'
			}

			img.onerror = () => {
				console.warn('Failed to load image from Unsplash.')
				bg.style.filter = 'blur(0)'
			}
		} else {
			console.warn('No image URL returned from backend.')
			bg.style.filter = 'blur(0)'
		}
	} catch (error) {
		console.error('Failed to fetch background image:', error)
		bg.style.filter = 'blur(0)'
	}
}

// Handler for the form submission
weatherForm.addEventListener('submit', (event) => {
	event.preventDefault()

	// Get the value we provide at the input field
	const location = search.value
	messageOne.textContent = 'Loading...'
	messageTwo.textContent = ''

	// Call the function fetch          // .then method is the second argument to the function
	fetch(`/weather?address=${location}`).then((response) => {
		response.json().then((data) => {
			if (data.error) {
				messageOne.textContent = data.error
			} else {
				let { location } = data
				messageOne.textContent = data.location
				messageTwo.textContent = data.forecast
				setBackgroundImage(location)
			}
		})
	})
})

// Set a default background image when the page loads
setBackgroundImage('weather')
