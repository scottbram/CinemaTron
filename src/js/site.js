/** site.js */
var sitewide = ( typeof (sitewide) === 'object' ) ? sitewide : {};
(sitewide = {
	init : function () {
		
		// console.log('just sayin');

		window.setTimeout( function () {
			$('body').css('visibility', 'visible');
		}, 200);
		
	}
}).init();
