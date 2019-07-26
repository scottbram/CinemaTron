/** utils.js */
var utils = ( typeof (utils) === 'object' ) ? utils : {};
(utils = {
	input_numbers_only : (inputRecvd) => {
		inputRecvd.replace(/[^0-9]/ig, '');

		return inputRecvd;
	}
	,
	validate_email : (str) => {
		let regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		
		if ( !regex.test(str) ) {
			return { 'valid_eml': false };
		} else {
			return { 'valid_eml': true };
		}
	}
	,
	validate_pw : (str) => {
		let validation_resp = {
			'valid_pw': false,
			'valid_pw_length': false,
			'valid_pw_length_msg': 'Need more password. ',
			'valid_cases': false,
			'valid_cases_msg': 'At least one upper case and one lower case letter required. ',
			'valid_pw_spcChar': false,
			'valid_pw_spcChar_msg': 'At least one special character required. '
		}
		
		if ( str.length > 7 ) {
			validation_resp.valid_pw_length = true;
		}

		// let regex_numNcases = /^(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*)$/;
		// let regex_numNcases = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/;

		let regex_cases = /^(?:(?=.*[a-z])(?=.*[A-Z]).*)$/;
		// let regex_cases = /^(?=.*[a-z])(?=.*[A-Z]).*$/;

		/* console.log('regex_cases: ');
		console.log(regex_cases.test(str)); */

		if ( regex_cases.test(str) ) {
			validation_resp.valid_cases = true;
		}

		// let regex_spcChar = /^(?:(?=.*\W).*)$/;
		let regex_spcChar = /^(?:(?=.*[#$@!%&*?_+-.,:]).*)$/;

		/* console.log('regex_spcChar: ');
		console.log(regex_spcChar.test(str)); */

		if ( regex_spcChar.test(str) ) {
			validation_resp.valid_pw_spcChar = true;
		}

		var allValid = validation_resp.valid_pw_length && validation_resp.valid_cases && validation_resp.valid_pw_spcChar;

		if ( allValid ) {
			validation_resp.valid_pw = true;
		}

		return validation_resp;
	}
});
