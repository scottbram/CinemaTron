/** account.js */
var account = ( typeof (account) === 'object' ) ? account : {};
(account = {
	init : () => {
		auth.sesh_check()
		.then( function (resp) {

			// console.log('resp[0].fields: ');
			// console.log(resp[0].fields);

			/**
			 * Fields:
			 * display_name
			 * email
			 * ​pwhash
			 * sesh
			 * uid
			 */

			let acctDetails = resp[0].fields;

			account.sesh_success(acctDetails);
		}).catch( errObj => {
			/** No valid session found */
			account.sesh_fail();
		});
	}
	,
	sesh_success : (acctDetails) => {
		auth.logout_init();
		account.load_acct_main(acctDetails);
	}
	,
	sesh_fail : () => {
		$('#acct_main .main-content .status-container').alert('close');

		var errMsg = '<div class="status-container alert alert-warning fade show" role="alert">' +
				'<span class="status-msg"><a id="log_in_prompt" href="#">Log in to edit</a></span>' +
			'</div>';
		
		$('#acct_main .main-content').prepend(errMsg);

		auth.login_modal_init();
	}
	,
	load_acct_main : (acctDetails) => {
		/* $.ajax({
			url: '/.netlify/functions/at_get_movie?recid=all',
			dataType: 'json'
		}).done( function (resp) {
			if (resp.length > 0) {
				
			}
		}); */

		$('#auth_pw_set_dispName').val(acctDetails.display_name);
		$('#auth_pw_set_email').val(acctDetails.email);

		window.setTimeout( function () {
			account.ready();
		}, 200);
	}
	,
	ready : () => {
		$('#acct_main .main-content .status-container').alert('close');
		$('#auth_pw_set').removeAttr('style');
		$('#acct_main .main-content').css('overflow', 'auto');

		/** Need to revise this approach to address on-demand validation when fields change */
		auth.input_validation();
	}
}).init();
