const Airtable = require('airtable')
const bcrypt = require('bcryptjs')
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
const at_table_users = at_base('users')

exports.handler = async (event, context, callback) => {
	var resp
	var req_obj = JSON.parse(event.body)
	var rec_fields = req_obj.fields

	console.log(rec_fields)

	const { login_email, login_pw } = req_obj.body;

	try {
		resp = await bcrypt.hash(login_pw, 10, function (err, hash) {
			if (err) {
				console.error(err);
				return;
			}
	
			var upd_result = at_table_users.update(
				login_email,
				{
					password: hash
				},
				function (err) {
					if (err) {
						console.error(err);
						return;
					}
				}
			);
	
			return upd_result;
		});
		
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
