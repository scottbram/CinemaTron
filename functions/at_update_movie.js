const Airtable = require('airtable')
// The next 2 lines refer to environment variables configured in Netlify settings (found in "Site settings > Build & deploy > Environment" as of this writing)
const { AIRTABLE_API_KEY } = process.env
// const { AIRTABLE_BASE_ID } = process.env
const at_base = new Airtable({
		apiKey: AIRTABLE_API_KEY
	})
	.base('appESVtnPeSwbPbUA')
const at_table_movies = at_base('movies')

exports.handler = async (event, context) => {

	// console.log(event)

	var resp

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
		resp = await at_table_movies.update(
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
};
