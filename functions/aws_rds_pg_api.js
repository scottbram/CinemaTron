const pg = require('pg');
const conn = "pg://scottbram:Th3-2019-1mpr3z4@cinematron.cuet4d0ykwbx.us-west-1.rds.amazonaws.com:5432/cinematron";
const client = new pg.Client(conn);

exports.handler = async (event, context, callback) => {
	/*context.callbackWaitsForEmptyEventLoop = false;
	var resp;
	var client = new pg.Client(conn);

	client.connect();

	let query = 'SELECT * FROM cinematron';

    resp = await client.query(query);

	console.log(resp);

	client.end();
	
	return {
		statusCode: 200,
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(resp)
	}*/

	await client.connect()

	const res = await client.query('SELECT NOW()')
	
	console.log(res)
	
	await client.end()
};
