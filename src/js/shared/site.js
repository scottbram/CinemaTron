/** site.js */
var sitewide = ( typeof (sitewide) === 'object' ) ? sitewide : {};
(sitewide = {
	init : () => {
		$('#login').on('submit', function (e) {
			e.preventDefault();

			if ( $.trim( $('#login-email').val() ) !== '' && $.trim( $('#login-pw').val() ) !== '' ) {
				
				console.log('submit');
				
				/* var ser_data = $(this).serialize();
				
				console.log( $(this).serialize() );

				$.post('/.netlify/functions/gtjs_auth', ser_data); */

				sitewide.login_do();
			} else {
				
				console.log('not so submit...');

			}
		});
		/* $('#login-do').click( function (e) {
			sitewide.login_do();
		}); */

		/** Meager attempt to mitigate FOUT */
		window.setTimeout( function () {
			$('body').css('visibility', 'visible');
		}, 200);
	}
	,
	login_do : () => {
		var req_obj = {};

		$.each( $('#login input'), function (idx, itm) {
			var fldName = $(itm).attr('id');
			var fldVal = $(itm).val();

			req_obj[fldName] = fldVal;
		});

		console.log(req_obj);

		var req_str = JSON.stringify(req_obj);

		$.ajax({
			url: '/.netlify/functions/gtjs_auth',
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
