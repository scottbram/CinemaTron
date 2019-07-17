/** index.js */
var movie_listings = ( typeof (movie_listings) === 'object' ) ? movie_listings : {};
(movie_listings = {
	init : () => {
		$.ajax({
			url: '/.netlify/functions/at_get_movie?recid=all',
			dataType: 'json'
		}).done( function (resp) {

			/*console.log('resp: ');
			console.log(resp);*/

			if (resp.length > 0) {
				$.each(resp, function(idx, itm) {
					var movie_recid = itm.id;
					/**
					  * Fields:
					  * Active
					  * Title
					  * Year
					  * Length
					  * Rating
					  * Format
					  * Art
					  * Created
					  * Modified
					  */
					var movie_obj 		= itm.fields;
					var movie_active 	= movie_obj.Active;
					
					/** 
					 * Currently, movie listing and movie admin share a common GET request
					 * responding with all movies regardless of Active value.
					 * However, the goal would be, via param or unique request, 
					 * to have a movie listing response with only Active movies
					 * making this if statement unnecessary
					 * and elimintaing the need to parse records that aren't relevant to this view.
					 */
					if (movie_active) {
						var movie_art 		= movie_obj.Art;
						var movie_title 	= movie_obj.Title;
						var movie_year 		= movie_obj.Year;
						var movie_length 	= movie_obj.Length;
						var movie_rating 	= movie_obj.Rating;
						var movie_format 	= movie_obj.Format;

						if (typeof movie_art !== 'undefined' && movie_art.length > 0) {
							
							// console.log(movie_art);

							/** 
							 * Get the movie poster thumbnail from the "Art" field,
							 * (which can contain multiple attachemts
							 * with associated URLs and metadata)
							 */
							var movie_art_poster_tn_lg, movie_art_poster_tn_full;
							$.each(movie_art, function (idx, itm) {
								if (itm.filename === 'poster.jpg') {
									movie_art_poster_tn_lg = itm.thumbnails['large'];
									movie_art_poster_tn_full = itm.thumbnails['full'];

									return;
								}
							});

							/*console.log(movie_art_poster_tn_full);
							console.log(movie_art_poster_tn_lg);
							console.log(movie_art_poster_tn_lg.url);
							console.log(movie_art_poster_tn_full.url);*/
						}

						/**
						 * Star ASCII codes
						 * - - - - - - - - -
						 * Solid star: &#9733;
						 * Outline star: &#9734;
						 */
						var movie_rating_stars = '';
							movie_rating_stars += '<span class="movie_rating_stars">';

						var ratingstar = 1;
						for (var i = 0; i < movie_rating; i++) {
							movie_rating_stars += '<span class="movie_rating_star" data-ratingstar="' + ratingstar + '">&#9733 </span>';

							ratingstar++;
						}

						movie_rating_stars += '</span><span class="movie_rating_stars_filler">';

						var movie_rating_stars_fillerCt = 5-movie_rating;
						for (i = 0; i < movie_rating_stars_fillerCt; i++) {
							movie_rating_stars += '<span class="movie_rating_star" data-ratingstar="' + ratingstar + '">&#9734 </span>';

							ratingstar++;
						}

						movie_rating_stars += '</span>';
						
						var movie_listing = '<div class="movie_listing" ' +
							'data-recid="' + movie_recid + '"">' +
							'<span class="movie_title">' + movie_title + '</span>' +
								'<div class="movie_details">' +
									movie_year + ' | ' + movie_length + ' minutes | ' + movie_rating_stars + ' | ' + movie_format +
								'</div>' +
							'</div>';

						$('#movie_list').append(movie_listing);

						if (idx+1 === resp.length) {
							movie_listings.ready();
						}
					}
				});
			}
		});
	}
	,
	ready : () => {
		window.setTimeout( function () {
			$('#movie_list_status').alert('close');
			$('#movie_list').css('overflow', 'auto');

			// $('#movie_list').css('visibility', 'visible');
		}, 200);
	}
}).init();
