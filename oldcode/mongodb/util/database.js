const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@myecom.xn6g1.mongodb.net/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;

const url = 'mongodb+srv://neerajsingh:Qwerty123@myecom.xn6g1.mongodb.net/newcom?retryWrites=true&w=majority';

let _db;

const mongoConnect = cb => {
	MongoClient.connect(url,  { useUnifiedTopology: true })
	.then(client => {
		_db = client.db();
		cb();
	})
	.catch(err => console.log(err))
}

const getDb = () => {
	if (_db) return _db;
	throw 'No Db';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;