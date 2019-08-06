const Airtable = require('airtable')
/** The next 2 lines refer to environment variables configured in Netlify settings (found in "Site settings > Build & deploy > Environment" as of this writing) */
const { AIRTABLE_API_KEY } = process.env
const { AIRTABLE_BASE_ID } = process.env
const at_base = new Airtable({
		apiKey: AIRTABLE_API_KEY
	})
	.base(AIRTABLE_BASE_ID)
const at_table_users = at_base('users')
const at_table_movies = at_base('movies')

exports.handler = async (event, context, callback) => {
	const qs_val_recid = event.queryStringParameters.recid
	var resp, sendBack

	var doSeshChk = false
	var cinesesh_str
	const req_cooks = event.headers['cookie']
	
	if (typeof req_cooks !== 'undefined') {
		doSeshChk = true

		var req_cooks_arr = req_cooks.split(';')
			.map( itm => itm.trim() )
			.map( itm => {
				var arr = itm.split('=')
				return {
					cooknom: arr[0],
					cookval: arr[1]
				}
			})

		cinesesh_str = req_cooks_arr.find( itm => itm.cooknom == 'cinesesh' )

		console.log('cinesesh_str.cookval: ')
		console.log(cinesesh_str.cookval)

	}

	function findUserBy (byFld, fldVal) {
		const filterFormula = "({" + byFld + "} = '" + fldVal + "')"

		return new Promise( (resolve, reject) => {
			at_table_users.select({
				maxRecords: 1,
				filterByFormula: filterFormula
			})
			.firstPage( function (err, records) {
				if (err) {
					console.error(err)
					reject(err)
				}
				
				resolve(records)
			})
		})
	}
	
	const checkSesh = await findUserBy('sesh', cinesesh_str.cookval)

	console.log('get_movvies checkSesh: ')
	console.log(checkSesh)

	if ( checkSesh.length === 0 ) {
		return {
			statusCode: 401,
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify([{validSesh: false}])
		}
	}

	// const userUid = checkSesh.uid

	try {
		// https://community.airtable.com/t/variable-in-filterbyformula/2251
		// filterFormula = "({field_name} = '" + value_to_filter_by + "')"

		console.log('record id: ' + qs_val_recid)

		if ( typeof qs_val_recid !== 'undefined' && qs_val_recid !== '' && qs_val_recid !== 'all' ) {
			resp = await at_table_movies.find(qs_val_recid);
		} else if (qs_val_recid === 'all') {
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
