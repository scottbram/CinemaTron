const Airtable = require('airtable')
// The next 2 lines refer to environment variables configured in Netlify settings (found in "Site settings > Build & deploy > Environment" as of this writing)
const { AIRTABLE_API_KEY } = process.env
const { AIRTABLE_BASE_ID } = process.env
const at_obj = new Airtable({
		apiKey: AIRTABLE_API_KEY
	})
	.base('appESVtnPeSwbPbUA')

exports.handler = async (event, context) => {
	// const mydocid_query = event.queryStringParameters.mydocid

	// console.log(event)
	console.log('event.httpMethod: ')
	console.log(event.httpMethod)

	var resp, sendBack

	switch (event.httpMethod) {
		case 'GET':
			try {
				// https://community.airtable.com/t/variable-in-filterbyformula/2251
				// filterFormula = "({mydocid} = '" + mydocid_query + "')"

				resp = await at_obj('movies')
					.select({
						maxRecords: 20,
						// filterByFormula: filterFormula
						sort: [{field: 'Year'}]
					})
					.firstPage()

				console.log('sendBack (GET): ')

				if (typeof resp !== 'undefined') {
					sendBack = {
						statusCode: 200,
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(resp)
					}

					console.log('...a bunch of good data...')
				} else {
					sendBack = {
						statusCode: 204,
						body: 'I got nada...'
					}

					console.log(sendBack)
				}

				return sendBack
			} catch (errObj) {
				const errBody = {
					'err_msg': errObj.message
				}

				console.log('Error (from catch): ');
				console.log(errObj);
				
				return {
		            statusCode: errObj.statusCode,
		            headers: { 'Content-Type': 'application/json' },
		            body: JSON.stringify(errBody)
		        }
			}
		break;
		case 'PATCH':

			console.log('PATCH request recvd')
			// console.log(event)

			var req_obj = JSON.parse(event.body)
			var rec_id = req_obj.ID
			var rec_fields = req_obj.fields

			console.log('req_obj: ')
			console.log(req_obj)

			console.log('rec_id: ')
			console.log(rec_id)

			console.log('rec_fields: ')
			console.log(rec_fields)

			try {
				resp = await at_obj('movies')
					.update(
						rec_id,
						rec_fields
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
			}
		break;
	}
};
