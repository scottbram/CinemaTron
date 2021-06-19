'use strict'

// const { MDBuser_filmlist_mdb_01 } = process.env
const MongoClient = require('mongodb').MongoClient;
let atlas_connection_uri;
let cachedDb = null;

exports.handler = (event, context, callback) => {

	console.log(' - - - - - - - - ');

	console.log('event: ');
	console.log(event);

	console.log('context: ');
	console.log(context);

	console.log('callback: ');
	console.log(callback);

	// const uri = "mongodb+srv://filmlist_mdb_01:" + MDBuser_filmlist_mdb_01 + "@alfaecho-cluster0-ezwrg.mongodb.net/test?retryWrites=true&w=majority"
	var uri = "mongodb+srv://filmlist_mdb_01:JxazMJSTMfGeoBMu@alfaecho-cluster0-ezwrg.mongodb.net/"
	// const client = new MongoClient(uri, { useNewUrlParser: true })

	console.log('uri: ');
	console.log(uri);
	
	console.log('event.httpMethod: ');
	console.log(event.httpMethod);

	// const mydocid_query = event.queryStringParameters.mydocid

	// var resp, sendBack;

	switch (event.httpMethod) {
		case 'GET':

			console.log('GET request recvd');

			// try {
				/*await client.connect(err => {
					const collection = client.db("cinematron").collection("movies")

					if (err) {
						console.error('[mongo] client err', err)
		        		
		        		return reject(err);
					}

					console.log('collection: ')
					console.log(collection)

					return collection

					client.close()
				})*/

				/*const client = await MongoClient.connect(uri, { useNewUrlParser: true })
				resp = client.db('cinematron').collection('movies')*/

				/*function connectToDatabase (uri) {
					if ( cachedDb && cachedDb.serverConfig.isConnected() ) {
						console.log('=> using cached database instance')
						
						return Promise.resolve(cachedDb)
					}
					
					return MongoClient.connect(uri)
						.then(client => { cachedDb = client.db('cinematron').collection('movies'); return cachedDb; });
				}*/

				if (atlas_connection_uri != null) {
					processEvent(event, context, callback);
				} else {
					atlas_connection_uri = uri;
					
					processEvent(event, context, callback);
				}

			/*} catch (errObj) {

				console.log('Error (from catch): ');
				console.log(errObj);

				const errBody = {
					'err_msg': errObj.message
				}
				
				return {
		            statusCode: 500,
		            headers: { 'Content-Type': 'application/json' },
		            body: JSON.stringify(errBody)
		        }
			}*/

			/*console.log('resp: ')
			console.log(resp)

			if (typeof resp !== 'undefined') {
				return {
					statusCode: 200,
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(resp)
				}
			}*/
		break;
		case 'PATCH':

			console.log('PATCH request recvd')
			console.log(event)

			/*var req_obj = JSON.parse(event.body)
			var rec_id = req_obj.ID
			var rec_title = req_obj.Title

			console.log(rec_id)
			console.log(rec_title)

			try {
				resp = await at_obj('movies')
					.update(
						rec_id,
						{
							'Title': rec_title
						}
					)

				return {
					statusCode: 200,
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(resp)
				}
			} catch (errObj) {
				return {
					statusCode: errObj.statusCode,
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(errObj)
				}
			}*/
		break;
	}

	console.log(' ^ ^ ^ ^ ^ ^ ^ ^ ')

};

function processEvent(event, context, callback) {
    
    console.log('Calling MongoDB Atlas from AWS Lambda with event: ' + JSON.stringify(event));
    
    //the following line is critical for performance reasons to allow re-use of database connections across calls to this Lambda function and avoid closing the database connection. The first call to this lambda function takes about 5 seconds to complete, while subsequent, close calls will only take a few hundred milliseconds.
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        //testing if the database connection exists and is connected to Atlas so we can try to re-use it
        if (cachedDb && cachedDb.serverConfig.isConnected()) {
            return {
				statusCode: 200,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(cachedDb)
			};
        } else {
            //some performance penalty might be incurred when running that database connection initialization code
            
            console.log(`=> connecting to database ${atlas_connection_uri}`);

            var resp = MongoClient.connect(atlas_connection_uri, { useNewUrlParser: true })
				.then(client => {
					cachedDb = client.db('cinematron').collection('movies');

					console.log(cachedDb);
					
					return cachedDb;
				});

			console.log(resp);
            
            return {
	            statusCode: 200,
	            headers: { 'Content-Type': 'application/json' },
	            body: JSON.stringify(resp)
	        };
        }
    }
    catch (err) {
        console.error('an error occurred', err);
    }
}
