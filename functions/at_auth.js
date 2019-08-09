const Airtable = require('airtable')
const bcrypt = require('bcryptjs')
// const clientSessions = require('client-sessions')

/** 
 * The following lines refer to environment variables.
 * These are configured online in Netlify settings (found in "Site settings > Build & deploy > Environment" as of this writing)
 * For local development via Netlify CLI, they go in netlify.toml under "[build.environment]"
 */
const {
	AIRTABLE_API_KEY,
	AIRTABLE_BASE_ID
} = process.env
const at_base = new Airtable({
		apiKey: AIRTABLE_API_KEY
	})
	.base(AIRTABLE_BASE_ID)
const at_table_users = at_base('users')

exports.handler = (event, context, callback) => {

	/* console.log('event: ')
	console.log(event) */

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
	
	function doHash (val_to_hash) {

		console.log('doHash val_to_hash: ')
		console.log(val_to_hash)

		return new Promise( (resolve, reject) => {
			bcrypt.hash(val_to_hash, 10, function (err, hash) {
				if (err) {
					console.error(err)
					reject(err)
				}
				
				resolve({hash: hash})
			})
		})
	}

	function storeVal (userUid, inFld, hash) {

		console.log('storeVal inFld: ')
		console.log(inFld)

		console.log('storeVal hash: ')
		console.log(hash)

		const hashStoreObj = {}
		hashStoreObj[inFld] = hash

		return new Promise( (resolve, reject) => {
			at_table_users.update(
				userUid,
				hashStoreObj,
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

	if (event.httpMethod === 'GET') {
		var auth_task = 'auth_check'

		const qs_val_auth_task = event.queryStringParameters.auth_task
		if (qs_val_auth_task === 'logout') {
			var auth_task = 'auth_logout'
		}
	}

	if (event.httpMethod !== 'GET') {
		const req_obj = JSON.parse(event.body)
		var { auth_task, auth_eml, auth_pw } = req_obj

		console.log('auth_task: ')
		console.log(auth_task)

		console.log('auth_eml: ')
		console.log(auth_eml)

		console.log('auth_pw: ')
		console.log(auth_pw)

	}

	switch (auth_task) {
		case 'auth_check': {
			if (doSeshChk) {
				findUserBy('sesh', cinesesh_str.cookval)
				.then( resp => {
					if (resp.length > 0) {
						callback(null, {
							statusCode: 200,
							headers: {'Content-Type': 'application/json'},
							body: JSON.stringify(resp)
						})
					} else {
						callback(null, {
							statusCode: 401,
							headers: {'Content-Type': 'application/json'},
							body: JSON.stringify([{validSesh: false}])
						})
					}
				})
				.catch( errObj => {
					
					console.error(errObj);
			
					callback({
						statusCode: errObj.statusCode,
						headers: {'Content-Type': 'application/json'},
						body: JSON.stringify(errObj)
					})
				})
			} else {
				callback(null, {
					statusCode: 401,
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify([{validSesh: false}])
				})
			}
			break;
		}
		case 'auth_login':

			console.log('oh, you wanna log in')
			
			findUserBy('email', auth_eml)
			.then( users => {

				/* console.log('then users: ')
				console.log(users) */

				if ( users.length > 0) {
					users.forEach( userObj => {
						bcrypt.compare(auth_pw, userObj.get("pwhash") )
						.then( matched => {
							if (matched) {
								/** Password is good! */
								
								console.log('userObj.fields: ')
								console.log(userObj.fields)

								const userUid = userObj.fields['uid']
								
								/* clientSessions({
									cookieName: 'cinesesh',
									secret: CLIENT_SESSIONS_SECRET,
									duration: 24 * 60 * 60 * 1000,
									activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
								}) */

								let val_to_hash = Date.now()
								val_to_hash = val_to_hash.toString()

								doHash(val_to_hash)
								.then( function (hashObj) {
		
									console.log('then hashObj: ')
									console.log(hashObj)
							
									console.log('hashObj.hash: ')
									console.log(hashObj.hash)
							
									return storeVal(userUid, 'sesh', hashObj.hash)
								})					
								.then( function (resp) {

									// console.log('sesh store good')

									// console.log('resp: ')
									// console.log(resp)

									callback(null, {
										statusCode: 200,
										headers: { 
											'Content-Type': 'application/json',
											'Set-Cookie': 'cinesesh=' + resp.fields['sesh'] + ';path=/;HttpOnly'
										},
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
		case 'auth_logout':

			console.log('auth_task: auth_logout')
			
			findUserBy('sesh', cinesesh_str)
			.then( users => {
				if ( users.length > 0) {
					users.forEach( userObj => {
						const userUid = userObj.fields['uid']
						
						storeVal(userUid, 'sesh', '')
					})
				}
							
				return
			})
			.then( function () {
				callback(null, {
					statusCode: 200,
					headers: { 
						'Content-Type': 'application/json',
						'Set-Cookie': 'cinesesh=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;HttpOnly'
					},
					body: JSON.stringify([{validSesh: false}])
				})
			})
			.catch( errObj => {
		
				console.error(errObj);
		
				callback({
					statusCode: errObj.statusCode,
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(errObj)
				})
			})

			break;
		case 'auth_pw_set': {
			const val_to_hash = auth_pw
			doHash(val_to_hash)
			.then( hashObj => {
		
				console.log('then hashObj: ')
				console.log(hashObj)
		
				console.log('hashObj.hash: ')
				console.log(hashObj.hash)
		
				return storeVal(userUid, 'pwhash', hashObj.hash);
			})
			.then( resp => {
				
				console.log('resp: ')
				console.log(resp)
				
				callback(null, {
					statusCode: 200,
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(resp)
				})
			})
			.catch( errObj => {
		
				console.error(errObj);
		
				callback({
					statusCode: errObj.statusCode,
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(errObj)
				})
			})
			
			break;
		}
	}
}
