/** utils.js */
var utils = ( typeof (utils) === 'object' ) ? utils : {};
(utils = {
	input_numbers_only : (inputRecvd) => {
		inputRecvd.replace(/[^0-9]/ig, '');

		return inputRecvd;
	}
});
