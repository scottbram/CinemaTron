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

	const { auth_task, auth_eml, auth_pw } = req_obj

	console.log('auth_pw: ')
	console.log(auth_pw)
	
	function doHash (auth_pw) {

		console.log('doHash auth_pw: ')
		console.log(auth_pw)

		return new Promise( (resolve, reject) => {
			bcrypt.hash(auth_pw, 10, function (err, hash) {
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
					pwhash: hash
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

	function getUsers (auth_eml) {
		const filterFormula = "({email} = '" + auth_eml + "')"

		return new Promise( (resolve, reject) => {
			at_table_users.select({
				maxRecords: 10,
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

	switch (auth_task) {
		case 'auth_pw_set':
			doHash(auth_pw)
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
		break;
		case 'auth_login':

			console.log('oh, you wanna log in')
			
			getUsers(auth_eml)
			.then( users => {

				console.log('then users: ')
				console.log(users)

				if ( users.length > 0) {
					users.forEach( function (userObj) {
						bcrypt.compare(auth_pw, userObj.get("pwhash") )
						.then( matched => {
							if (matched) {
								/** Password is good! */
								console.log('userObj.fields: ')
								console.log(userObj.fields)
								
								let resp = {
									'message': 'User is confirmed'
								}

								callback(null, {
									statusCode: 200,
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify(resp)
								})
							} else {
								/** Password fail */
	
								console.log('Password fail')
								
								let resp = {
									'statusCode': 401,
									'error': 'Incorrect Password',
									'message': 'Password is incorrect'
								}

								callback(null, {
									statusCode: 401,
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify(resp)
								})
							}
						})
					})
				} else {
					/** User not found */
	
					console.log('User not found')
					
					let resp = {
						'statusCode': 401,
						'error': 'User Not Found',
						'message': 'That user was not found'
					}
					
					callback(null, {
						statusCode: 401,
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(resp)
					})
				}
			})
			.catch( errObj => {
				
				console.log('Catch happens')
				console.error(errObj);
		
				callback(null, {
					statusCode: errObj.statusCode,
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(errObj)
				})
			})
		break;
	}
}
