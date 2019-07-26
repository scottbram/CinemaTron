/** site.js */
var sitewide = ( typeof (sitewide) === 'object' ) ? sitewide : {};
(sitewide = {
	init : () => {
		sitewide.track_changes_auth();

		/* $('#auth_pw_set').on('submit', function (e) {
			e.preventDefault();

			if ( $.trim( $('#auth_pw_set_email').val() ) !== '' && $.trim( $('#auth_pw_set_pw').val() ) !== '' ) {
				
				console.log('submit');
				
				sitewide.login_do();
			} else {
				
				console.log('not so submit...');

			}
		}); */
		/* $('#login-do').click( function (e) {
			sitewide.login_do();
		}); */
		$('#auth_pw_set, #auth_login').on('submit', function (e) {
			e.preventDefault();

			if ( $.trim( $(this).find('input[type=email]').val() ) !== '' && $.trim( $(this).find('input[type=password]').val() ) !== '' ) {
				
				console.log('submit');
				
				let form_is = $(this).attr('id');
				sitewide.auth_do(form_is);
			} else {
				
				console.log('not so submit...');

			}
		});

		/** Meager attempt to mitigate FOUT */
		window.setTimeout( function () {
			$('body').css('visibility', 'visible');
		}, 200);
	}
	,
	track_changes_auth : () => {
		$('body').on('input change', '.auth_form input', function (e) {
			var fld_el = $(this)[0];
			var fld_val = $(this).val();
			var fld_parentForm = $(this).closest('form');
			var fld_parentForm_id = fld_parentForm.attr('id');
			var fld_parentForm_valid = false;
			var fld_parentForm_allFlds_notEmpty = false;
			var fld_parentForm_allFlds_valid = false;
			
			if ( $.trim( fld_parentForm.find('input[type=email]').val() ) !== '' && $.trim( fld_parentForm.find('input[type=password]').val() ) !== '' ) {
				fld_parentForm_allFlds_notEmpty = true;
			}

			/* console.log('email valid:');
			console.log( fld_parentForm.find('input[type=email]').is(':valid') );

			console.log('pw valid');
			console.log( fld_parentForm.find('input[type=password]').is(':valid') ); */

			if ( fld_parentForm.find('input[type=email]').is(':valid') && fld_parentForm.find('input[type=password]').is(':valid') ) {
				fld_parentForm_allFlds_valid = true;
			}

			if (fld_parentForm_allFlds_notEmpty && fld_parentForm_allFlds_valid) {
				fld_parentForm_valid = true;
				fld_parentForm.find('button[type=submit]').attr('disabled', false);
			}

			/** Do some validation */
			fld_el.setCustomValidity('');
			
			if ( $(this).attr('type') === 'email' ) {
				
				// console.log('gonna validate an email');

				let { valid_eml } = utils.validate_email(fld_val);

				if ( valid_eml ) {
					fld_el.setCustomValidity('');
				} else {
					fld_el.setCustomValidity('Gonna need a valid email there, chief.');
				}
			}

			if ( $(this).attr('type') === 'password' ) {
				
				// console.log('gonna validate a password');
				
				let { 
					valid_pw, 
					valid_pw_length, 
					valid_pw_length_msg, 
					valid_cases, 
					valid_cases_msg, 
					valid_pw_spcChar, 
					valid_pw_spcChar_msg 
				} = utils.validate_pw(fld_val);

				console.log('valid_pw: ');
				console.log(valid_pw);
				
				if ( valid_pw ) {
					fld_el.setCustomValidity('');
					
					// return;
				}

				let customValidationMsg = '';
				
				/* console.log('valid_pw_length: ');
				console.log(valid_pw_length); */

				if ( !valid_pw_length ) {
					$(fld_parentForm).find('#auth_pw_set_hint_minLength').removeClass('valid').addClass('invalid');
					
					customValidationMsg += valid_pw_length_msg;
				} else {
					$(fld_parentForm).find('#auth_pw_set_hint_minLength').removeClass('invalid').addClass('valid');
				}

				/* console.log('valid_cases: ');
				console.log(valid_cases); */

				if ( !valid_cases ) {
					$(fld_parentForm).find('#auth_pw_set_hint_cases').removeClass('valid').addClass('invalid');

					customValidationMsg += valid_cases_msg;
				} else {
					$(fld_parentForm).find('#auth_pw_set_hint_cases').removeClass('invalid').addClass('valid');
				}

				/* console.log('valid_pw_spcChar: ');
				console.log(valid_pw_spcChar); */

				if ( !valid_pw_spcChar ) {
					$(fld_parentForm).find('#auth_pw_set_hint_spcChar').removeClass('valid').addClass('invalid');

					customValidationMsg += valid_pw_spcChar_msg;
				} else {
					$(fld_parentForm).find('#auth_pw_set_hint_spcChar').removeClass('invalid').addClass('valid');
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

			} else {
				
				console.log('Fld is valid!');

			}
		});
	}
	,
	auth_do : (form_is) => {
		var auth_task;

		switch (form_is) {
			case 'auth_pw_set':
				auth_task = 'pw_set';
			break;
			case 'auth_login':
				auth_task = 'login';
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
			success: function (resp, textStatus, jqXhr) {

				console.log('success event');

				console.log('resp: ');
				console.log(resp);

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

				alert('Error:\n' + err_disp);
			},
			complete: function() {

				console.log('complete event');

			}
		});
	}
	,
	auth_pw_set_do : () => {
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

				alert('Error:\n' + err_disp);
			},
			complete: function() {

				console.log('complete event');

			}
		});
	}
	,
	auth_login_do : () => {
		var req_obj = {
			'task': 'login'
		};

		$.each( $('#auth_login input'), function (idx, itm) {
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

				alert('Error:\n' + err_disp);
			},
			complete: function() {

				console.log('complete event');

			}
		});
	}
}).init();
