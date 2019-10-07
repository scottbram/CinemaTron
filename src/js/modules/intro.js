/** intro.js */
var intro = ( typeof (intro) === 'object' ) ? intro : {};
(intro = {
	init : () => {
		auth.sesh_check()
		.then( function () {
			intro.sesh_success();
		}).catch( errObj => {
			/** No valid session found */
			intro.sesh_fail();
		});
	}
	,
	sesh_success : () => {
		auth.logout_init();
	}
	,
	sesh_fail : () => {
		auth.login_btn_init();
	}

}).init();
