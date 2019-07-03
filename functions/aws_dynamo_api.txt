const AWS = require('aws-sdk')
const fs = require('fs')
AWS.config.update({
	endpoint: 'https://dynamodb.us-west-2.amazonaws.com'
})
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
	// const mydocid_query = event.queryStringParameters.mydocid

	console.log(' - - - - - - - - ')

	console.log('uri: ')
	console.log(uri)
	
	console.log('event.httpMethod: ')
	console.log(event.httpMethod)

	var resp, sendBack

	switch (event.httpMethod) {
		case 'GET':

			console.log('GET request recvd')
			
			console.log('event: ')
			console.log(event)

			try {
				

console.log("Importing movies into DynamoDB. Please wait.");

var allMovies = JSON.parse(fs.readFileSync('moviedata.json', 'utf8'));
allMovies.forEach(function(movie) {
    var params = {
        TableName: "Movies",
        Item: {
            "year":  movie.year,
            "title": movie.title,
            "info":  movie.info
        }
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add movie", movie.title, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", movie.title);
       }
    });
});

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

				const client = await MongoClient.connect(uri, { useNewUrlParser: true })
				resp = client.db("cinematron").collection("movies")
			} catch (errObj) {

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
			}

			console.log('resp: ')
			console.log(resp)

			if (typeof resp !== 'undefined') {
				return {
					statusCode: 200,
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(resp)
				}
			}
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