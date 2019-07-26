const Airtable = require('airtable')
/** The next 2 lines refer to environment variables configured in Netlify settings (found in "Site settings > Build & deploy > Environment" as of this writing) */
const { AIRTABLE_API_KEY } = process.env
const { AIRTABLE_BASE_ID } = process.env
const at_base = new Airtable({
		apiKey: AIRTABLE_API_KEY
	})
	.base(AIRTABLE_BASE_ID)
const at_table_movies = at_base('movies')

exports.handler = async (event, context, callback) => {
	const rec_id_qs = event.queryStringParameters.recid
	var resp, sendBack

	try {
		// https://community.airtable.com/t/variable-in-filterbyformula/2251
		// filterFormula = "({field_name} = '" + value_to_filter_by + "')"

		console.log('record id: ' + rec_id_qs)

		if ( typeof rec_id_qs !== 'undefined' && rec_id_qs !== '' && rec_id_qs !== 'all' ) {
			resp = await at_table_movies.find(rec_id_qs);
		} else if (rec_id_qs === 'all') {
			resp = await at_table_movies.select({
					maxRecords: 20,
					// filterByFormula: filterFormula
					sort: [{field: 'Year'}]
				})
				.firstPage()
		}

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
}
