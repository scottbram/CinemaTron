/** account.js */
var account = ( typeof (account) === 'object' ) ? account : {};
(account = {
	init : () => {
		auth.sesh_check()
		.then( resp => {
			/**
			 * Fields:
			 * display_name
			 * email
			 * pwhash
			 * sesh
			 * uid
			 */

			let acctDetails = resp[0].fields;

			account.sesh_success(acctDetails);
		})
		.catch( () => {
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
		$('#acct_main_mgmt').attr('data-atrecid', acctDetails.uid);
		$('#acct_main_mgmt_dispName').val(acctDetails.display_name);
		$('#acct_main_mgmt_email').val(acctDetails.email);

		window.setTimeout( function () {
			account.ready();
		}, 200);
	}
	,
	save_details : () => {
		const acct_uid = document.getElementById('acct_main_mgmt').getAttribute('data-atrecid');

		let req_obj = {
			'ID': acct_uid
		};

		var req_obj_flds = {};
		let acct_details = document.getElementsByClassName('acct-details');
		acct_details = [...acct_details];

		acct_details.forEach( (itm) => {
			let fld_name = itm.getAttribute('data-atfld');
			let fld_val = itm.value

			req_obj_flds[fld_name] = fld_val;
		});

		req_obj.fields = req_obj_flds;

		var req_str = JSON.stringify(req_obj);

		console.log('save_details: ');
		console.log(req_str);

		const saveAcctDetails_promise = new Promise( function (promSuccess, promError) {
			$.ajax({
				url: '/.netlify/functions/at_update_acct',
				type: 'PATCH',
				contentType: 'application/json',
				data: req_str,
				success: function () {
					/** Reset fields to unchanged style */
					// $('#movie_listing_' + movie_recid).find('.valChg, .valChg-colorsOnly').removeClass('valChg valChg-colorsOnly');

					// $('#movie_listing_' + movie_recid).find('.movie_rating_stars').removeClass('valChg-colorsOnly');

					promSuccess();
				},
				error: function (jqXHR, textStatus, errorThrown) {

					console.error('error event');
					
					console.log('jqXHR: ');
					console.log(jqXHR);

					console.log('textStatus: ');
					console.log(textStatus);
					
					console.log('errorThrown: ');
					console.log(errorThrown);
					
					var err_disp;

					if (typeof jqXHR.responseJSON !== 'undefined') {
						let err_statusCode = jqXHR.responseJSON['statusCode'];
						let err_is = jqXHR.responseJSON['error'];
						let err_msg = jqXHR.responseJSON['message'];

						err_disp = err_statusCode + '\n' + err_is + '\n' + err_msg;
					} else {
						err_disp = jqXHR.responseText;
					}

					promError();
					
					console.error('Error:\n' + err_disp);

					if (jqXHR.status === 401) {
						auth.show_login_modal();
					}
				},
				/* complete: function() {

					console.log('complete event');

				} */
			});
		});

		return saveAcctDetails_promise;
	}
	,
	save_pw : () => {
		var passToPass = $('#acct_main_mgmt_pw').val();

		if (passToPass === '' ) {
			return 'nopw';
		}

		const acct_pw_chg = async () => {
			const doPwSave = await auth.pw_set_do(passToPass);

			return await doPwSave;
		}

		const saveAcctPw_promise = new Promise( function (promSuccess, promError) {
			acct_pw_chg()
				.then( () => {
					$('#acct_main_mgmt_pw').val('').attr('type', 'password');
					$('#acct_main_mgmt_pw_toggle_vis').prop('checked', false);

					promSuccess();
				})
				.catch( errObj => {
					
					console.error('Password save error');
					console.log(errObj);

					promError();
				})
		});

		return saveAcctPw_promise;
	}
	,
	ready : () => {
		$('#acct_main_mgmt').on('input change', 'input', function () {
			$(this).addClass('valChg');

			$('#acct_save_do').prop('disabled', false);
		});

		$('#acct_main_mgmt_pw_toggle_vis').on('change', function () {
			if ( $(this).prop('checked') ) {
				$('#acct_main_mgmt_pw').attr('type', 'text');
			} else {
				$('#acct_main_mgmt_pw').attr('type', 'password');
			}
		});

		$('#acct_save_do').click( function () {
			$(this).prop('disabled', true);
			account.status_msg('saving');

			const saveBoth = async () => {
				await account.save_pw();
				await account.save_details();

				// throw new Error('b0rked.');
			}

			saveBoth()
				.then ( () => {
					account.status_msg('save_success');
				})
				.catch( err => {
					
					console.log(err);

				})

			let respMsg = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
				<strong>Holy guacamole!</strong> You should check in on some of those fields below.
				<button type="button" class="close" data-dismiss="alert" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>`;
		});
		
		$('#acct_main .main-content .status-container').alert('close');
		$('#acct_main_mgmt').removeAttr('style');
		$('#acct_main .main-content').css('overflow', 'auto');

		/** Need to revise this approach to address on-demand validation when fields change */
		auth.input_validation();
	}
	,
	status_msg : (status_msg) => {
		switch (status_msg) {
			case 'saving':
					$('.actions-msgs .msg_saveStatus').remove();

					$('.actions-msgs').prepend('<small class="msg_saveStatus msg_chgsSaved msg-info">Saving...</small>');
			break;
			case 'save_success':
				$('#acct_main_mgmt input').removeClass('valChg');
				$('#acct_save_do').blur();
				
				/** Remove any messages about save status */
				$('.actions-msgs .msg_saveStatus').remove();

				$('.actions-msgs').prepend('<small class="msg_saveStatus msg_chgsSaved msg-success">All changes saved.</small>');

				/** After specificed delay, fade the message, then remove from DOM */
				window.setTimeout( function () {
					$('.actions-msgs .msg_chgsSaved').fadeOut('slow', function () {
						$(this).remove();
					});
				}, 2000);
			break;
			case 'save_error':
				// 
			break;
		}
	}
}).init();
