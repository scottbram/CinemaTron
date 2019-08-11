/** site.js */
var sitewide = ( typeof (sitewide) === 'object' ) ? sitewide : {};
(sitewide = {
	init : () => {
		/** Meager attempt to mitigate FOUT */
		window.setTimeout( function () {
			$('body').css('visibility', 'visible');
		}, 200);
	}
}).init();
