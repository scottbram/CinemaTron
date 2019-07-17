const Airtable = require('airtable')
/** 
 * The following 2 lines refer to environment variables.
 * These are configured online in Netlify settings (found in "Site settings > Build & deploy > Environment" as of this writing)
 * For local development via Netlify CLI, they go in netlify.toml under "[build.environment]"
 */
const { AIRTABLE_API_KEY } = process.env
/** Didn't work locally via Netlify CLI, so just using direct value for now */
// const { AIRTABLE_BASE_ID } = process.env
const at_base = new Airtable({
		apiKey: AIRTABLE_API_KEY
	})
	.base('appESVtnPeSwbPbUA')
const at_table_movies = at_base('movies')

exports.handler = async (event, context, callback) => {
	var resp
	var req_obj = JSON.parse(event.body)
	var rec_id = req_obj.ID
	var rec_fields = req_obj.fields

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
