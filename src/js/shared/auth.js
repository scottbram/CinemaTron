/** auth.js */
var auth = ( typeof (auth) === 'object' ) ? auth : {};
(auth = {
	init : () => {
		$.ajax({
			url: '/.netlify/functions/at_auth'
		})
	}
	,
	check_sesh : (nom, val) => {
		var found = false;
		
		document.cookie.split(';').forEach( function (e) {
		
			var cookie = e.split('=');
		
			if (nom === cookie[0].trim() && (!val || val == cookie[1].trim()) ) {
	
				found = true;
			}
		})
		
		return found;
	}
	,
}).init();
