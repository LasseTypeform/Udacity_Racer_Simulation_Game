// PROVIDED CODE BELOW (LINES 1 - 80) DO NOT REMOVE

// The store will hold all information needed globally
const store = {
	track_id: undefined,
	track_name: undefined,
	player_id: undefined,
	race_id: undefined,
}

// We need our javascript to wait until the DOM is loaded

document.addEventListener("DOMContentLoaded", function() {
	onPageLoad()
	setupClickHandlers()
})

async function onPageLoad() {
	try {
		getTracks()
			.then(tracks => {
				const html = renderTrackCards(tracks)
				renderAt('#tracks', html)
			})

		getRacers()
			.then((racers) => {
				const html = renderRacerCars(racers)
				renderAt('#racers', html)
			})
	} catch(error) {
		console.log("Problem getting tracks and racers ::", error.message)
		console.error(error)
	}
}

function setupClickHandlers() {

	document.addEventListener('click', function(event) {
		const { target } = event
	
		// Race track form field
		if (target.matches('.card.track')) {
			handleSelectTrack(target)
		}

		// Podracer form field
		if (target.matches('.card.podracer', '.card.podracer.h3', '.card.podracer.p')) {
			handleSelectPodRacer(target)
		}

		// Submit create race form
		if (target.matches('#submit-create-race')) {
			event.preventDefault()
	
			// start race
			handleCreateRace()
		}

		// Handle acceleration click
		if (target.matches('#gas-peddle')) {
			handleAccelerate(target)
		}

	}, false)
}

async function delay(ms) {
	try {
		return await new Promise(resolve => setTimeout(resolve, ms));
	} catch(error) {
		console.log("an error shouldn't be possible here")
		console.log(error)
	}
}
// ^ PROVIDED CODE ^ DO NOT REMOVE


// function to update store
const updateStore = (currState, keyValuPair) => {
	store = Object.assign({}, currState, keyValuPair)
}

// This async function controls the flow of the race, add the logic and error handling
async function handleCreateRace() {

	if(store.player_id !== undefined && store.track_id !== undefined) {

	// render starting UI
	renderAt('#race', renderRaceStartView(store.track_name))
	
	// Get player_id and track_id from the store
	const state = Object.assign(store)
	
	// invoke the API call to create the race
	try {
		const res = await createRace(state.player_id, state.track_id)
		const raceID = (res.ID -1)
	// update the store with the race id
		updateStore(store, {race_id: raceID})
	// The race has been created, now start the countdown
	// call the async function runCountdown
	await runCountdown()
	// call the async function startRace
	await startRace(store.race_id)
	// call the async function runRace
	await runRace(store.race_id)
	}
	catch(error){ console.log(error)}

	}
}

function runRace(raceID) {
	return new Promise(resolve => {
	// get race info every 500ms
	try { 
		const raceInterval = setInterval( async function(){
		const res = await getRace(raceID)

	// If the race info status property is "in-progress", update the leaderboard by calling:

		if(res.status === "in-progress"){
			renderAt('#leaderBoard', raceProgress(res.positions))
		}
		
		// if the race info status property is "finished", the following will run :

		if(res.status === "finished"){
		clearInterval(raceInterval) // to stop the interval from repeating
		renderAt('#race', resultsView(res.positions)) // to render the results view
		resolve(res) // resolve the promise
		}
	
	}, 500)
	}
	catch(err){console.log(error.message)}	
	})
}

async function runCountdown() {
	try {
		// wait for the DOM to load
		await delay(1000)
		let timer = 3

		return new Promise(resolve => {
			// method to count down once per second
			const intervalcountdown = setInterval(function(){

			// run this DOM manipulation to decrement the countdown for the user
			document.getElementById('big-numbers').innerHTML = --timer

			// if the countdown is done, clear the interval, resolve the promise, and return
			if(timer <= 0) {
				clearInterval(intervalcountdown)
				resolve("done")
				return 
			}
				
			}, 1000)
		})
	} catch(error) {
		console.log(error);
	}
	
}


function handleSelectPodRacer(target) {

	// remove class selected from all racer options
	const selected = document.querySelector('#racers .selected')
	if(selected) {
		selected.classList.remove('selected')
	}

	// add class selected to current target
	target.classList.add('selected')
	// Save the selected racer to the store
	return updateStore(store, {player_id: Number(target.id)})	
}

function handleSelectTrack(target) {

	// remove class selected from all track options
	const selected = document.querySelector('#tracks .selected')
	if(selected) {
		selected.classList.remove('selected')
	}

	// add class selected to current target
	target.classList.add('selected')

	// Save the selected track id to the store
	updateStore(store, {track_id: target.id})
	updateStore(store, {track_name: target.innerText})
}

function handleAccelerate() {
	console.log("accelerate button clicked")
	// Invoke the API call to accelerate
	accelerate(store.race_id)
}

// HTML VIEWS ------------------------------------------------
// Provided code - do not remove

function renderRacerCars(racers) {
	if (!racers.length) {
		return `
			<h4>Loading Racers...</4>
		`
	}

	const results = racers.map(renderRacerCard).join('')

	return `
		<ul id="racers">
			${results}
		</ul>
	`
}

function renderRacerCard(racer) {
	const { id, driver_name, top_speed, acceleration, handling } = racer

	return `
		<li class="card podracer" id="${id}">
			<h3>${driver_name}</h3>
			<p>${top_speed}</p>
			<p>${acceleration}</p>
			<p>${handling}</p>
		</li>
	`
}

function renderTrackCards(tracks) {
	if (!tracks.length) {
		return `
			<h4>Loading Tracks...</4>
		`
	}

	const results = tracks.map(renderTrackCard).join('')

	return `
		<ul id="tracks">
			${results}
		</ul>
	`
}

function renderTrackCard(track) {
	const { id, name } = track

	return `
		<li id="${id}" class="card track">
			<h3>${name}</h3>
		</li>
	`
}

function renderCountdown(count) {
	return `
		<h2>Race Starts In...</h2>
		<p id="big-numbers">${count}</p>
	`
}

function renderRaceStartView(track, racers) {
	return `
		<header>
			<h1>Race: ${track.name}</h1>
		</header>
		<main id="two-columns">
			<section id="leaderBoard">
				${renderCountdown(3)}
			</section>

			<section id="accelerate">
				<h2>Directions</h2>
				<p>Click the button as fast as you can to make your racer go faster!</p>
				<button id="gas-peddle">Click Me To Win!</button>
			</section>
		</main>
		<footer></footer>
	`
}

function resultsView(positions) {
	positions.sort((a, b) => (a.final_position > b.final_position) ? 1 : -1)

	return `
		<header>
			<h1>Race Results</h1>
		</header>
		<main>
			${raceProgress(positions)}
			<a class="button "href="/race">Start a new race</a>
		</main>
	`
}

function raceProgress(positions) {

	const userPlayer = positions.find(e => e.id == store.player_id)
	userPlayer.driver_name += " (you)"

	positions = positions.sort((a, b) => (a.segment > b.segment) ? -1 : 1)
	let count = 1

	const results = positions.map(p => {
		return `
			<tr>
				<td>
					<h3>${count++} - ${p.driver_name}</h3>
				</td>
			</tr>
		`
	})

	return `
		<main class="main-results">
			<h3>Leaderboard</h3>
			<section id="leaderBoard">
				${results}
			</section>
		</main>
	`
}

function renderAt(element, html) {
	const node = document.querySelector(element)

	node.innerHTML = html
}

// ^ Provided code ^ do not remove


// API CALLS ------------------------------------------------

const SERVER = 'http://localhost:8000'

function defaultFetchOpts() {
	return {
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin' : SERVER,
		},
	}
}

// Call API to retrieve all the tracks
async function getTracks() {
	try{
		const res = await fetch(`${SERVER}/api/tracks`)

		const tracks = await res.json()

		console.log('tracks from API', tracks)
		return tracks
	}
	catch(error){
		console.log(error.message)
	}
}


// Call API to retrieve all the racers
async function getRacers() {

	try{
		const res = await fetch(`${SERVER}/api/cars`)

		const racers = await res.json()

		console.log('Racers from API', racers)
		return racers
	}
	catch(error){
		console.log(error.message)
	}
}

// Call API to create the race
function createRace(player_id, track_id) {
	player_id = parseInt(player_id)
	track_id = parseInt(track_id)
	const body = { player_id, track_id }
	
	return fetch(`${SERVER}/api/races`, {
		method: 'POST',
		...defaultFetchOpts(),
		dataType: 'jsonp',
		body: JSON.stringify(body)
	})
	.then(res => res.json())
	.catch(err => console.log("Problem with createRace request::", err))
}

// Call to get status of the race
async function getRace(id) {
	try{
		const res = await fetch(`${SERVER}/api/races/${id}`)

		const race = await res.json()

		console.log('race', race)
		return race
	}
	catch(error){
		console.log(error.message)
	}
}

// Call to initate the race
function startRace(id) {
	return fetch(`${SERVER}/api/races/${id}/start`, {
		method: 'POST',
		...defaultFetchOpts(),
	})
	.then(res => res)
	.catch(err => console.log("Problem with getRace request::", err))
}

// Call to add acceleration to the racers during the race
async function accelerate(id) {
	try{
		const res = await fetch(`${SERVER}/api/races/${id}/accelerate`, {
			method: 'POST',
			...defaultFetchOpts(),
		})
		return res
	}
	catch(error) {
		console.log("Problem with getRace request::", error)
	} 
}

