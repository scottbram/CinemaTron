const Airtable = require('airtable')
const bcrypt = require('bcryptjs')
/** 
 * The following 2 lines refer to environment variables.
 * These are configured online in Netlify settings (found in "Site settings > Build & deploy > Environment" as of this writing)
 * For local development via Netlify CLI, they go in netlify.toml under "[build.environment]"
 */
const { AIRTABLE_API_KEY } = process.env
const { AIRTABLE_BASE_ID } = process.env
const { TESTUSER_RECORD_ID } = process.env
const at_base = new Airtable({
		apiKey: AIRTABLE_API_KEY
	})
	.base(AIRTABLE_BASE_ID)
const at_table_users = at_base('users')

exports.handler = (event, context, callback) => {
	const req_obj = JSON.parse(event.body)

	console.log('req_obj: ')
	console.log(req_obj)

	const { login_pw } = req_obj

	console.log('login_pw: ')
	console.log(login_pw)

	function doHash (login_pw) {

		console.log('doHash login_pw: ')
		console.log(login_pw)

		return new Promise( (resolve, reject) => {
			bcrypt.hash(login_pw, 10, function (err, hash) {
				if (err) {
					console.error(err)
					reject(err)
				}
				else {
					resolve({
						hash: hash
					})
				}
			})
		})
	}

	function storeHash (hash) {

		console.log('storeHash hash: ')
		console.log(hash)

		console.log('storeHash TESTUSER_RECORD_ID: ')
		console.log(TESTUSER_RECORD_ID)

		return new Promise( (resolve, reject) => {
			at_table_users.update(
				TESTUSER_RECORD_ID,
				{
					password: hash
				},
				function (err, record) {
					if (err) {
						console.error(err)
						reject(err)
					} else {
						resolve(record)
					}
				}
			)
		})
	}

	
	doHash(login_pw)
	.then( function (hashObj) {

		console.log('then hashObj: ')
		console.log(hashObj)

		console.log('hashObj.hash: ')
		console.log(hashObj.hash)

		return storeHash(hashObj.hash);
	})
	.then( function (resp) {
		
		console.log('resp: ')
		console.log(resp)
		
		callback(null, {
			statusCode: 200,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(resp)
		})
	})
	.catch( function (errObj) {

		console.error(errObj);

		callback({
			statusCode: errObj.statusCode,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(errObj)
		})
	});
}
