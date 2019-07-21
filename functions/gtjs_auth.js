const GoTrue = require('gotrue-js')

const auth = new GoTrue({
	APIUrl: 'https://cinematron.site/.netlify/identity',
	audience: '',
	setCookie: false
});

exports.handler = async (event, context, callback) => {
	
	console.log('- - - event - - -')
	console.log(event)

	console.log('- - - context - - -')
	console.log(context)

	console.log('- - - callback - - -')
	console.log(callback)
	
	var resp
	var req_obj = JSON.parse(event.body)

	console.log('- - - req_obj - - -')
	console.log(req_obj)

	try {
		resp = await auth.login(req_obj.email, req_obj.pw)

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
