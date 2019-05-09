const MongoClient = require('mongodb').MongoClient;
const Server = require('mongodb').Server;
const url = process.env.NODE_ENV === 'production' ? 'mongo' : 'localhost';
const port = 27017;
const dbName = 'my-turk';
const collection = 'experiments';

let client;
var _db;

module.exports = {
	connectToServer: () => {
		let status = {};
		status.success = false;
		client = new MongoClient(new Server(url, port));

		let connection = new Promise((resolve, reject) => {

			client.connect((err, mongoClient) => {
				try {
					let db = mongoClient.db(dbName);
					resolve(db);
				} catch (e) {
					reject(e);
				}
			});
		}).then(async (db) => {
			_db = db;
			status.success = true;
			return status;
		}).catch((err) => {
			status.success = false;
			status.error = err;
			console.log('err', err);

			return status;
		});
		return connection;
	},
	getDb: () => {
		return db;
	},
	insertData: async (mData, mCollection = collection) => {
		let collection = _db.collection(mCollection);
		let response = {};
		let result = await new Promise((resolve, reject) => {
			collection.insertOne(mData)
				.then((result) => { resolve(result) })
				.catch((err) => { reject(err) });
		});
		return result;
	},
	findData: (data = {}, mCollection = collection) => {
		let collection = _db.collection(mCollection);
		let response = {};

		let result = new Promise((resolve, reject) => {
			collection.find(data).toArray((err, result) => {
				if (err) { reject(err) }
				resolve(result);
			});
		});
		return result;
	},

	/*
	 * update if exists otherwise insert 
	 */
	updateData: async (findOldValue, newValue, mCollection = collection) => {
		let collection = _db.collection(mCollection);
		let response = {};
		let updateOptions = { upsert: true };
		let updateQuery = { $set: newValue };

		let result = await new Promise((resolve, reject) => {
			console.log('findOldValue', findOldValue)
			collection.updateOne(findOldValue, updateQuery, updateOptions, (err, result) => {
				if (err) { reject(err) }
				resolve(result);
			});
		});
		return result;
	},
	removeData: async (entry = {}, mCollection = collection) => {
		let collection = _db.collection(mCollection);

		let result = await new Promise((resolve, reject) => {
			collection.deleteMany(entry)
				.then((result) => { resolve(result) })
				.catch((err) => { reject(err) });;
		});
		return result;
	},
	close: () => {
		client.close();
		console.log("Closed the server successfully");
	}
};
