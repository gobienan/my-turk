const express = require('express');
const reload = require('express-reload')
const logger = require('morgan');
const bodyParser = require("body-parser");
const cors = require('cors')
const mongo = require('./services/mongo');
const mturkManagement = require('./api/mturk');

let app = express();

const hostname = '127.0.0.1';
const port = 3001;

// Connection URL

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/mturk', mturkManagement);

app.listen(port, hostname, async () => {
	console.log(`Server running at http://${hostname}:${port}/`);
	const status = await mongo.connectToServer();
	if (status.success) {
		console.log(`Started DB at http://localhost:27017/`);
	}
});

module.exports = app;
