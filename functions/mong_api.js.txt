const MongoClient = require('mongodb').MongoClient;
let cachedDb = null;

var co = require('co');

let conn = null;

const uri = 'mongodb://filmlist_mdb_01:JxazMJSTMfGeoBMu@alfaecho-cluster0-ezwrg.mongodb.net/cinematron';

exports.handler = (event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;

	run().
		then(res => {
		callback(null, res);
	}).
	catch(error => callback(error));
};

function run() {
  return co(function*() {

    if (conn == null) {
      conn = yield MongoClient.connect(uri, {
        useNewUrlParser: true,
        bufferCommands: false,
        bufferMaxEntries: 0
      });
      conn.model('movies', new MongoClient.Schema({
      	title: String,
		length: String,
		year: String,
		rating: String,
		format: String
      }));
    }

    const M = conn.model('movies');

    const doc = yield M.find();
    const response = {
      statusCode: 200,
      body: JSON.stringify(doc)
    };
    return response;
  });
}
