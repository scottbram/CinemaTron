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
	const rec_id_qs = event.queryStringParameters.recid
	var resp, sendBack

	// console.log(event)

	try {
		// https://community.airtable.com/t/variable-in-filterbyformula/2251
		// filterFormula = "({mydocid} = '" + mydocid_query + "')"

		console.log('record id: ' + rec_id_qs)

		if ( typeof rec_id_qs !== 'undefined' && rec_id_qs !== '' ) {
			// localhost:8888/.netlify/functions/at_get_movie?recid=recgYgj9HIfvXUZmo
			console.log('find')

			resp = await at_table_movies.find(rec_id_qs);

			console.log('resp: ')
			console.log(resp)

		} else {

			console.log('select')

			resp = await at_table_movies.select({
					maxRecords: 20,
					// filterByFormula: filterFormula
					sort: [{field: 'Year'}]
				})
				.firstPage()
		}

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
};
