const Airtable = require('airtable')
/** 
 * The following 2 lines refer to environment variables.
 * These are configured online in Netlify settings (found in "Site settings > Build & deploy > Environment" as of this writing)
 * For local development via Netlify CLI, they go in netlify.toml under "[build.environment]"
 */
const { AIRTABLE_API_KEY } = process.env
const { AIRTABLE_BASE_ID } = process.env
const at_base = new Airtable({
		apiKey: AIRTABLE_API_KEY
	})
	.base(AIRTABLE_BASE_ID)
const at_table_movies = at_base('movies')
const at_table_users = at_base('users')

exports.handler = async (event, context, callback) => {
	var resp
	var req_obj = JSON.parse(event.body)
	var rec_fields = req_obj.fields
	var cinesesh_str
	const req_cooks = event.headers['cookie']

	if (typeof req_cooks === 'undefined') {
		return {
			statusCode: 401,
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify([{validSesh: false}])
		}
	}
	
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

	if ( checkSesh.length === 0 ) {
		return {
			statusCode: 401,
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify([{validSesh: false}])
		}
	}

	try {
		resp = await at_table_movies.create(
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
}
