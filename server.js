const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');
const app = express();

// Dev app
if (app.get('env') === 'development') {
	require('dotenv').load();
	const cors = require('cors');
	app.use(cors());
}

const SERVER_PORT = process.env.PORT || 5001;

// APIs
const api = require('./serverApis/usersApi')

// Body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Routes
app.use('/', api)

// Production app
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, 'build')));
	app.get('*', function (req, res) {
		res.sendFile(path.join(__dirname, 'build', 'index.html'));
	});
}

// Error handling
app.use(function (req, res) {
	res.status(404).send('Page not found');
});
app.use(function (error, req, res, next) {
	res.status(500).send(`An error has occured: ${error}`);
});

app.listen(SERVER_PORT, () => { console.log(`${getTimestamp()} - App listening on port ${SERVER_PORT}`) });

function getTimestamp() { return moment().format('YYYY-MM-DD HH:mm:ss') }