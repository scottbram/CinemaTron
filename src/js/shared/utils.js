/** utils.js */
var utils = ( typeof (utils) === 'object' ) ? utils : {};
(utils = {
	input_numbers_only : (inputRecvd) => {
		inputRecvd.replace(/[^0-9]/ig, '');

		return inputRecvd;
	}
	,
	validate_email : (str) => {
		let validation_resp = {
			'valid_eml': false
		}

		let regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		
		if ( regex.test(str) ) {
			validation_resp['valid_eml'] = true;
		}

		return validation_resp;
	}
	,
	validate_pw : (str) => {
		let validation_resp = {
			'valid_pw': false,
			'valid_pw_length': false,
			'valid_pw_length_msg': 'Need more password. ',
			// 'valid_ltrCases': false,
			// 'valid_ltrCases_msg': 'At least one upper case and one lower case letter required. ',
			'valid_ltrCases_upper': false,
			'valid_ltrCases_upper_msg': 'At least one upper case letter required. ',
			'valid_ltrCases_lower': false,
			'valid_ltrCases_lower_msg': 'At least one lower case letter required. ',
			'valid_number': false,
			'valid_number_msg': 'At least one number required. ',
			'valid_pw_spcChar': false,
			'valid_pw_spcChar_msg': 'At least one special character required. '
		}
		
		if ( str.length > 7 ) {
			validation_resp.valid_pw_length = true;
		}

		// let regex_numNltrCases = /^(?:(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*)$/;
		// let regex_numNltrCases = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/;

		/* let regex_ltrCases = /^(?:(?=.*[A-Z])(?=.*[a-z]).*)$/;
		if ( regex_ltrCases.test(str) ) {
			validation_resp.valid_ltrCases = true;
		} */

		let valid_ltrCases_upper = /^(?:(?=.*[A-Z]).*)$/;
		if ( valid_ltrCases_upper.test(str) ) {
			validation_resp.valid_ltrCases_upper = true;
		}

		let valid_ltrCases_lower = /^(?:(?=.*[a-z]).*)$/;
		if ( valid_ltrCases_lower.test(str) ) {
			validation_resp.valid_ltrCases_lower = true;
		}

		let valid_number = /^(?:(?=.*\d).*)$/;
		if ( valid_number.test(str) ) {
			validation_resp.valid_number = true;
		}

		let regex_spcChar = /^(?:(?=.*[#$@!%&*?_+-.,:]).*)$/;

		if ( regex_spcChar.test(str) ) {
			validation_resp.valid_pw_spcChar = true;
		}

		var allValid = validation_resp.valid_pw_length && validation_resp.valid_ltrCases && validation_resp.valid_pw_spcChar;

		if ( allValid ) {
			validation_resp.valid_pw = true;
		}

		return validation_resp;
	}
});
