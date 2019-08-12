/** auth.js */
var auth = ( typeof (auth) === 'object' ) ? auth : {};
(auth = {
	sesh_check : () => {
		return new Promise( (resolve, reject) => {
				$.ajax({
				url: '/.netlify/functions/at_auth',
				dataType: 'json'
			}).done( function (resp) {
				if (resp.length > 0) {
					resolve(resp);
				}
			}).fail( function ( jqXHR, textStatus, errorThrown ) {
				reject(jqXHR, textStatus, errorThrown);
			});
		})
	}
	,
	input_validation : () => {
		$('body').on('input change', '.auth_form input', function () {
			var fld_el = $(this)[0];
			var fld_val = $(this).val();
			var fld_parentForm = $(this).closest('form');
			// var fld_parentForm_id = fld_parentForm.attr('id');
			var fld_parentForm_valid = false;
			var fld_parentForm_allFlds_notEmpty = false;
			var fld_parentForm_allFlds_valid = false;

			/** Do some validation */
			fld_el.setCustomValidity('');
			
			if ( $(this).attr('type') === 'email' ) {
				let { valid_eml } = utils.validate_email(fld_val);

				if ( valid_eml ) {
					fld_el.setCustomValidity('');
				} else {
					fld_el.setCustomValidity('Please check that the email is correct.');
				}
			}

			if ( $(this).attr('type') === 'password' ) {
				let { 
					valid_pw, 
					valid_pw_length, 
					valid_pw_length_msg, 
					valid_ltrCases, 
					valid_ltrCases_msg, 
					valid_pw_spcChar, 
					valid_pw_spcChar_msg 
				} = utils.validate_pw(fld_val);

				// console.log('valid_pw: ');
				// console.log(valid_pw);
				
				if ( valid_pw ) {
					fld_el.setCustomValidity('');
				}

				let customValidationMsg = '';
				
				if ( !valid_pw_length ) {
					$(fld_parentForm).find('.validHelp_minLength').removeClass('valid').addClass('invalid');
					
					customValidationMsg += valid_pw_length_msg;
				} else {
					$(fld_parentForm).find('.validHelp_minLength').removeClass('invalid').addClass('valid');
				}

				if ( !valid_ltrCases ) {
					$(fld_parentForm).find('.validHelp_ltrCases').removeClass('valid').addClass('invalid');

					customValidationMsg += valid_ltrCases_msg;
				} else {
					$(fld_parentForm).find('.validHelp_ltrCases').removeClass('invalid').addClass('valid');
				}

				if ( !valid_pw_spcChar ) {
					$(fld_parentForm).find('.validHelp_spcChar').removeClass('valid').addClass('invalid');

					customValidationMsg += valid_pw_spcChar_msg;
				} else {
					$(fld_parentForm).find('.validHelp_spcChar').removeClass('invalid').addClass('valid');
				}

				fld_el.setCustomValidity(customValidationMsg);
			}

			/** https://developer.mozilla.org/en-US/docs/Web/API/ValidityState */
			/* console.log('fld_el.validity: ');
			console.log(fld_el.validity); */
			/* console.log('fld_el.checkValidity(): ');
			console.log(fld_el.checkValidity()); */

			/** This delivers the custom validation messages */
			var fld_isValid = fld_el.checkValidity();

			if (!fld_isValid) {
				
				console.log('Fld invalid. fld_el.validationMessage: ');
				console.log(fld_el.validationMessage);

			}

			if ( $.trim( fld_parentForm.find('input[type=email]').val() ) !== '' && $.trim( fld_parentForm.find('input[type=password]').val() ) !== '' ) {
				fld_parentForm_allFlds_notEmpty = true;
			}

			if ( fld_parentForm.find('input[type=email]').is(':valid') && fld_parentForm.find('input[type=password]').is(':valid') ) {
				fld_parentForm_allFlds_valid = true;
			}

			if (fld_parentForm_allFlds_notEmpty && fld_parentForm_allFlds_valid) {
				fld_parentForm_valid = true;
				$('#auth_login_do').prop('disabled', false);
			} else {
				fld_parentForm_valid = false;
				$('#auth_login_do').prop('disabled', true);
			}
		});
	}
	,
	show_login_modal : () => {
		function login_modal_go () {
			$('#auth_login_actions_msgs').empty();

			$('#auth_login_do').prop('disabled', true);
			$('#auth_login input').prop('disabled', true);
			
			$('#auth_login_modal .modal-body').prepend('<div class="overlay overlay-enlighten" aria-hidden="true"></div>');
			$('#auth_login_modal .overlay').prepend('<span class="spinner spinner-border spinner-border-md" role="status" aria-hidden="true"></span>');

			auth.login_do();
		}

		$.get('components/_auth_login.html', function (theGotten) {
			$('body').append(theGotten);

			$('#auth_login_modal').on('show.bs.modal', function () {
				auth.input_validation();

				setTimeout( function () {
					$('.auth_form input').trigger('change');
				}, 500);
				
				$('#auth_login input').off('keypress');
				$('#auth_login input').keypress( function (e) {
					if (e.which === 13 && !$('#auth_login_do').prop('disabled') ) {
						login_modal_go();
					}
				});

				$('#auth_login_do').off('click');
				$('#auth_login_do').on('click', function (e) {
					login_modal_go();
				});
			});

			$('#auth_login_modal').on('shown.bs.modal', function () {
				if ( $.trim( $('#auth_login').find('input[type=email]').val() ) === '' && $.trim( $('#auth_login').find('input[type=password]').val() ) === '' ) {
					$('#auth_login_email').focus();
				}
			});

			$('#auth_login_modal').on('hidden.bs.modal', function () {
				$('#auth_login_modal').modal('dispose');
				$('#auth_login_modal').remove();
			});

			$('#auth_login_modal').modal({
				backdrop: 'static'
			});
			$('#auth_login_modal').modal('show');
		});
	}
	,
	auth_do : (form_is) => {
		console.log(req_obj);

		var auth_task;

		switch (form_is) {
			case 'auth_pw_set':
				auth_task = 'auth_pw_set';
			break;
			case 'auth_login':
				auth_task = 'auth_login';
			break;
		}
		var req_obj = {
			'auth_task': auth_task
		};

		$.each( $('#' + form_is + ' input'), function (idx, itm) {
			var fldName = $(itm).attr('data-authfld');
			var fldVal = $(itm).val();

			req_obj[fldName] = fldVal;
		});

		console.log(req_obj);

		var req_str = JSON.stringify(req_obj);

		$.ajax({
			url: '/.netlify/functions/at_auth',
			type: 'POST',
			contentType: 'application/json',
			data: req_str,
			success: function () {
				window.location.reload(true);
			},
			error: function (jqXHR, textStatus, errorThrown) {

				console.log('error event');
				
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

					if (err_statusCode === 401) {
						/** The user entered invalid credentials */
						
						console.log('Communicate the specific authentication problem to user')

					}
				} else {
					err_disp = jqXHR.responseText;
				}

				console.error('Error:\n' + err_disp);
			},
			complete: function() {

				console.log('complete event');

			}
		});
	}
	,
	pw_set_do : () => {
		var req_obj = {
			'task': 'pw_set'
		};

		$.each( $('#auth_pw_set input'), function (idx, itm) {
			var fldName = $(itm).attr('id');
			var fldVal = $(itm).val();

			req_obj[fldName] = fldVal;
		});

		console.log(req_obj);

		var req_str = JSON.stringify(req_obj);

		$.ajax({
			url: '/.netlify/functions/at_auth',
			type: 'POST',
			contentType: 'application/json',
			data: req_str,
			success: function (resp, textStatus, jqXhr) {

				console.log('success event');

				console.log('resp: ');
				console.log(resp);

				console.log('textStatus: ');
				console.log(textStatus);

				console.log('jqXhr: ');
				console.log(jqXhr);

			},
			error: function (jqXHR, textStatus, errorThrown) {

				console.log('error event');
				
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

				console.error('Error:\n' + err_disp);
			},
			complete: function() {

				console.log('complete event');

			}
		});
	}
	,
	login_do : () => {
		var req_obj = {
			'auth_task': 'auth_login'
		};

		$.each( $('#auth_login input'), function (idx, itm) {
			var fldName = $(itm).attr('data-authfld');
			var fldVal = $(itm).val();

			req_obj[fldName] = fldVal;
		});

		console.log('req_obj: ');
		console.log(req_obj);

		var req_str = JSON.stringify(req_obj);

		$.ajax({
			url: '/.netlify/functions/at_auth',
			type: 'POST',
			contentType: 'application/json',
			data: req_str,
			success: function (resp) {
				auth.login_success(resp);
			},
			error: function (jqXHR, textStatus, errorThrown) {

				console.log('error event');
				
				console.log('jqXHR: ');
				console.log(jqXHR);

				console.log('textStatus: ');
				console.log(textStatus);
				
				console.log('errorThrown: ');
				console.log(errorThrown);
				
				var err_disp;
				var err_disp_msg;

				if (typeof jqXHR.responseJSON !== 'undefined') {
					let err_statusCode = jqXHR.responseJSON['statusCode'];
					err_disp_msg = jqXHR.responseJSON['error'];
					let err_msg = jqXHR.responseJSON['message'];

					err_disp = err_statusCode + '\n' + err_disp_msg + '\n' + err_msg;
				} else {
					err_disp = jqXHR.responseText;
				}

				console.error('Error:\n' + err_disp);

				$('#auth_login_actions_msgs').prepend('<small class="msg_loginStatus msg-warning">Please check that the login info is correct</small>');

				/** Reset the modal state */
				$('#auth_login_do').prop('disabled', false);
				$('#auth_login input').prop('disabled', false);
				
				$('#auth_login_modal .modal-body .overlay').remove();
			},
			complete: function() {

				console.log('complete event');

			}
		});
	}
	,
	login_success : () => {
		/** When there's no recently edited fields present, refresh page */
		if ( $('.valChg').length === 0 ) {
			location.reload();
		} else {
			var saveBtns = $('.save:disabled');
			$.each(saveBtns, function () {
				if ( $(this).is(':visible') ) {
					$(this).prop('disabled', false)
				}
			});

			$('#auth_login_modal').modal('hide');
		}
	}
	,
	logout_do : () => {
		$.ajax({
			url: '/.netlify/functions/at_auth?auth_task=logout',
			type: 'GET',
			success: function (resp) {
				auth.logout_success();
			},
			error: function (jqXHR, textStatus, errorThrown) {

				console.log('error event');
				
				console.log('jqXHR: ');
				console.log(jqXHR);

				console.log('textStatus: ');
				console.log(textStatus);
				
				console.log('errorThrown: ');
				console.log(errorThrown);
				
				var err_disp;
				var err_disp_msg;

				if (typeof jqXHR.responseJSON !== 'undefined') {
					let err_statusCode = jqXHR.responseJSON['statusCode'];
					err_disp_msg = jqXHR.responseJSON['error'];
					let err_msg = jqXHR.responseJSON['message'];

					err_disp = err_statusCode + '\n' + err_disp_msg + '\n' + err_msg;
				} else {
					err_disp = jqXHR.responseText;
				}

				console.error('Error:\n' + err_disp);

				// $('#auth_login_actions_msgs').prepend('<small class="msg_loginStatus msg-warning">Please check that the login info is correct</small>');
			},
			complete: function() {

				console.log('complete event');

			}
		});
	}
	,
	logout_success : () => {
		location.reload();
	}
});
