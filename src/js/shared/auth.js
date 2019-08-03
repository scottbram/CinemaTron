/** auth.js */
var auth = ( typeof (auth) === 'object' ) ? auth : {};
(auth = {
	init : () => {
		sitewide.auth_sesh_check();
	}
}).init();
