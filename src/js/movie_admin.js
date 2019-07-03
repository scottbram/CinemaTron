/** movie-admin.js */
var movie_admin = ( typeof (movie_admin) === 'object' ) ? movie_admin : {};
(movie_admin = {
	init : function () {
		$.ajax({
			url: '/.netlify/functions/at_api',
			dataType: 'json'
		}).done( function ( resp, textStatus, jqXHR ) {

			/*console.log('resp: ');
			console.log(resp);*/

			if (resp.length > 0) {
				$.each(resp, function(idx, itm) {
					var movie_recid = itm.id;
					/**
					  * Fields:
					  * Title
					  * Year
					  * Length
					  * Rating
					  * Format
					  * Art
					  */
					var movie_obj 		= itm.fields;
					var movie_title 	= movie_obj.Title;
					var movie_year 		= movie_obj.Year;
					var movie_length 	= movie_obj.Length;
					var movie_rating 	= movie_obj.Rating;
					var movie_format 	= movie_obj.Format;
					var movie_art 		= movie_obj.Art;

					/**
					 * Star ASCII codes
					 * - - - - - - - - -
					 * Solid star: &#9733;
					 * Outline star: &#9734;
					 */
					var movie_rating_stars = '';
						movie_rating_stars += '<div class="movie_rating_stars">';
					/** Set the lowest value */
					var ratingstar = 1;
					/** Add a selected indicator to the object until the selected rating value is reached */
					for (var i = 0; i < movie_rating; i++) {
						movie_rating_stars += '<span class="movie_rating_star movie_rating_star_selected" data-ratingstar="' + ratingstar + '">&#9733 </span>';
						
						ratingstar++;
					}
					/** Subtract the selected rating from the highest possible to get an unselected/filler count */
					var movie_rating_star_totalCt = 5;
					var movie_rating_star_unselectedCt = movie_rating_star_totalCt-movie_rating;
					/** Add an unselected indicator to the object until filler count is reached */
					for (i = 0; i < movie_rating_star_unselectedCt; i++) {
						movie_rating_stars += '<span class="movie_rating_star movie_rating_star_unselected" data-ratingstar="' + ratingstar + '">&#9734  </span>';

						ratingstar++;
					}
					movie_rating_stars += '</div>';

					var DVDsel, STRsel, VHSsel;
					switch (movie_format) {
						case 'DVD':
							DVDsel = 'selected';
						break;
						case 'Streaming':
							STRsel = 'selected';
						break;
						case 'VHS':
							VHSsel = 'selected';
						break;
					}
					
					var movie_listing = '<div class="movie_listing form-group" ' +
							'data-recid="' + movie_recid +'"' +
							'data-haschgs="false"' +
							'id="movie_listing_' + movie_recid + '"' +
						'>' +
							// '<div class="movie_poster"></div>' +
							'<div class="movie_title">' +
								'<label for="movie_title_' + movie_recid + '">Title <small class="text-muted">(50 characters or less)</small></label>' +
								'<input id="movie_title_' + movie_recid + '"' +
									' value="' + movie_title + '"' +
									' data-fldname="Title"' +
									' data-ogval="' + movie_title + '"' +
									' class="form-control"' +
									' type="text" minlength="1" maxlength="50">' +
							'</div>' +
							'<div class="movie_details">' +
								'<div class="movie_year">' +
									'<label for="movie_year_' + movie_recid + '">Year <small class="text-muted">(from 1800 to 2100)</small></label>' +
									'<input id="movie_year_' + movie_recid + '"' +
										' value="' + movie_year + '"' +
										' data-fldname="Year"' +
										' data-ogval="' + movie_year + '"' +
										' class="form-control"' +
										' type="number" min="1800" max="2100">' +
								'</div>' +
								'<div class="movie_length">' +
									'<label for="movie_length_' + movie_recid + '">Length <small class="text-muted">(in minutes)</small></label>' +
									'<input id="movie_length_' + movie_recid + '"' +
										' value="' + movie_length + '"' +
										' data-fldname="Length"' +
										' data-ogval="' + movie_length + '"' +
										' class="form-control"' +
										' type="number" min="0" max="500">' +
								'</div>' +
								'<div class="movie_rating">' +
									'<label for="movie_rating_' + movie_recid + '">Rating</label>' +
									movie_rating_stars +
									'<input id="movie_rating_' + movie_recid + '"' +
										' value="' + movie_rating + '"' +
										' data-fldname="Rating"' +
										' data-ogval="' + movie_rating + '"' +
										' class="form-control"' +
										' type="number" min="1" max="5" hidden>' +
								'</div>' +
								'<div class="movie_format">' +
									'<label for="movie_format_' + movie_recid + '">Format</label>' +
									'<select id="movie_format_' + movie_recid + '" class="custom-select"' +
										' data-fldname="Format"' +
										' data-ogval="' + movie_format + '"' +'>' +
										// '<option selected>Open this select menu</option>' +
										'<option value="DVD"' + DVDsel + '>DVD</option>' +
										'<option value="Streaming"' + STRsel + '>Streaming</option>' +
										'<option value="VHS"' + VHSsel + '>VHS</option>' +
									'</select>' +
								'</div>' +
							'</div>' +
						'</div>'
					;

					$('#movie_admin_list').append(movie_listing);

					if (idx+1 === resp.length) {
						movie_admin.ready();
					}
				});
			}
		}).fail( function ( jqXHR, textStatus, errorThrown ) {
			$('#movie_list_status').alert('close');

			console.log('textStatus: ');
			console.log(textStatus);
			console.log('errorThrown: ');
			console.log(errorThrown);

			var errMsg = '<div id="movie_list_status" class="alert alert-warning fade show" role="alert">' +
					'<span id="movie_list_status_msg">There was a problem loading the movies.</br>Try refreshing the page and if the problem persists, please contact us.</span>' +
				'</div>';
			
			$('#movie_admin').prepend(errMsg);
		});
	}
	,
	ready : function () {
		$('#movie_list_status').alert('close');

		$('.save_all').show();
		
		movie_admin.track_changes_field();
		movie_admin.rating_hover();
		movie_admin.rating_click();
		movie_admin.save_all_click();

		/*var tempSaveWarning = '<div class="alert alert-warning fade show" role="alert">' +
  				'<strong>HEADS UP!</strong> Only the first movie title will save at the moment...' +
			'</div>';

		// $('#movie_admin_list_actions').hover( function () {
			$('#movie_admin_list_actions').append(tempSaveWarning);
		// }, function() {
			// $('#movie_admin_list_actions .alert').alert('close');
		// });*/
	}
	,
	track_changes_field : function () {
		$('#movie_admin_list').on('input change', 'input', function (e) {
			var ogVal = $(this).attr('data-ogval');
			var currVal = $(this).val();

			/** If the current value isn't the original value, mark the field */
			if (ogVal !== currVal) {
				$(this).addClass('valChg');

				/** If a .valChgMsg isn't already present, add it */
				/*if ( $(this).nextAll('.valChgMsg').length === 0 ) {
					$(this).after('<small class="text-muted valChgMsg">Unsaved change</small>');
				}*/
			} else {
				$(this).removeClass('valChg').nextAll('.valChgMsg').remove();
			}

			movie_admin.track_changes_listing( $(this) );
		});

		$('#movie_admin_list').on('change', 'select', function (e) {
			var ogVal = $(this).attr('data-ogval');
			var currVal = $(this).val();

			/** If the current value isn't the original value, mark the field */
			if (ogVal !== currVal) {
				$(this).addClass('valChg');

				/** If a .valChgMsg isn't already present, add it */
				/*if ( $(this).nextAll('.valChgMsg').length === 0 ) {
					$(this).after('<small class="text-muted valChgMsg">Unsaved change</small>');
				}*/
			} else {
				$(this).removeClass('valChg').nextAll('.valChgMsg').remove();
			}

			movie_admin.track_changes_listing( $(this) );
		});
	}
	,
	track_changes_listing : function (jqObj) {

		console.log('jqObj: ');
		console.log(jqObj);

		var hasChgs = jqObj.closest('.movie_listing').find('input, select').hasClass('valChg');

		console.log("jqObj.closest('.movie_listing'): ");
		console.log(jqObj.closest('.movie_listing'));

		if (hasChgs) {
			jqObj.closest('.movie_listing').attr('data-haschgs', true);
		} else {
			jqObj.closest('.movie_listing').attr('data-haschgs', false);
		}

		movie_admin.save_all_check();
	}
	,
	rating_hover : function () {
		$('.movie_rating_star').hover(
			function () {
				/** Make hovered item into selected state */
				$(this).html('&#9733 ');

				/** 
				 * Make all sibling items before hovered item into the selected state 
				 * and add class that will make them the selected color
				 */
				$(this).prevAll('.movie_rating_star').html('&#9733 ').addClass('movie_rating_hover_prevSib');

				/** 
				 * Make all sibling items after hovered item into the unselected state 
				 * and add class that will make them the unselected color
				 */
				$(this).nextAll('.movie_rating_star').html('&#9734 ').addClass('movie_rating_hover_nextSib');
			}, function () {
				$(this).siblings().removeClass('movie_rating_hover_prevSib').removeClass('movie_rating_hover_nextSib');
				
				/** Reset all stars to original state */
				if ( $(this).hasClass('movie_rating_star_selected') ) {
					$(this).html('&#9733 ');
				} else {
					$(this).html('&#9734 ');
				}
				$(this).siblings('.movie_rating_star_selected').html('&#9733 ');
				$(this).siblings('.movie_rating_star_unselected').html('&#9734 ');
			}
		);
	}
	,
	rating_click : function () {
		$('.movie_rating_star').click( function (e) {
			var movie_rating_sel = $(this).attr('data-ratingstar');
			var movie_recid = $(this).closest('.movie_listing').attr('data-recid');

			$('#movie_rating_' + movie_recid).val(movie_rating_sel).change();
			// $('#movie_rating_' + movie_recid).val(movie_rating_sel);
			// $('#movie_rating_' + movie_recid).attr('value', movie_rating_sel);

			/** 
			 * Make selcted item 
			 * and all sibling items before it 
			 * into the selected state 
			 * and add class that will make them the selected color
			 */
			$(this).addClass('movie_rating_star_selected').removeClass('movie_rating_star_unselected');
			$(this).prevAll('.movie_rating_star').addClass('movie_rating_star_selected').removeClass('movie_rating_star_unselected');

			/** 
			 * Make all sibling items after selected item into the unselected state 
			 * and add class that will make them the unselected color
			 */
			$(this).nextAll('.movie_rating_star').addClass('movie_rating_star_unselected').removeClass('movie_rating_star_selected');
		});
	}
	,
	save_all_check : function () {
		if ( $('.valChg').length !== 0 ) {
			$('.save_all').prop('disabled', false);

			/** If an .unsavedChgMsg isn't already present, add it */
			if ( $('.save_all').nextAll('.unsavedChgMsg').length === 0 ) {
				$('.save_all').after('<small class="text-muted unsavedChgMsg">There are unsaved changes!</small>');
			}
		} else {
			$('.save_all').prop('disabled', true);
			$('.save_all').nextAll('.unsavedChgMsg').remove();
		}
	}
	,
	save_all_click : function () {
		$('.save_all').click( function (e) {
			if ( $('#movie_title_recgYgj9HIfvXUZmo').hasClass('valChg') ) {
				movie_admin.save_all();
			}
		});
	}
	,
	save_all : function () {
		/** Manually-specified values for development */
		/*var movie_recid = 'recgYgj9HIfvXUZmo',
			movie_title = $('#movie_listing_' + movie_recid + ' .movie_title input').val(),
			var req_obj = {
				'ID': movie_recid,
				'Title': movie_title
			};*/

		/**
		 * This will break the request as a way of demoing error handling
		 */
		// var movie_title 	= $('#' + movie_recid + ' .movie_title input');

		/** Gather changes and send PATCH request to API per movie */

		/** 
		 * Changes need to be grouped per record (i.e., movie)
		 * 
		 * Pretty sure the best option is to 
		 * flag a parent element (e.g., ".movie_listing") on changes,
		 * using that as the starting point 
		 * to traverse down children
		 * and collect changes.
		 *
		 * If all changes for a given record are backed out
		 * clear flag on parent element
		 */

		var chgdMoviesArr = $('.movie_listing[data-haschgs="true"]');

		$.each(chgdMoviesArr, function (idx, itm) {
			var movie_recid = $(itm).attr('data-recid');
			var req_obj = {
				'ID': movie_recid
			};
			var req_obj_flds = {};

			console.log('movie_recid: ');
			console.log(movie_recid);

			var chgdFldsArr = $('#movie_listing_' + movie_recid).find('.valChg');

			console.log('chgdFldsArr: ');
			console.log(chgdFldsArr);

			/** 
			 * For each changed field, 
			 * get the attribute value that has the associated field name in the data store
			 * along with the field value 
			 * to build an object of key/value pairs 
			 * to send in each request
			 */

			$.each(chgdFldsArr, function (idx_fld, itm_fld) {
				var fldName = $(itm_fld).attr('data-fldname');
				var fldVal = $(itm_fld).val();

				if ( fldName === 'Year' | fldName === 'Length' | fldName === 'Rating' ) {
					fldVal = Number(fldVal);
				}

				console.log('fldName: ');
				console.log(fldName);
				console.log('fldVal: ');
				console.log(fldVal);
				
				req_obj_flds[fldName] = fldVal;
			});

			req_obj.fields = req_obj_flds;

			console.log('req_obj: ');
			console.log(req_obj);

			var req_str = JSON.stringify(req_obj);

			console.log('req_str: ');
			console.log(req_str);

			$.ajax({
				url: '/.netlify/functions/at_api',
				type : 'PATCH',
				// dataType: 'json',
			    contentType: 'application/json',
				data: req_str,
				success : function (resp, textStatus, jqXhr) {

					console.log('success event');

					console.log('resp: ');
					console.log(resp);
					
					console.log('textStatus: ');
					console.log(textStatus);

					if (idx+1 === chgdMoviesArr.length) {
						window.location.reload(true);
					}
				},
				error : function (jqXHR, textStatus, errorThrown) {

					console.log('error event');
					
					console.log('jqXHR: ');
					console.log(jqXHR);

					console.log('textStatus: ');
					console.log(textStatus);
					
					console.log('errorThrown: ');
					console.log(errorThrown);
					
					var err_disp;

					if (typeof jqXHR.responseJSON !== 'undefined') {
						err_statusCode = jqXHR.responseJSON['statusCode'];
						err_is = jqXHR.responseJSON['error'];
						err_msg = jqXHR.responseJSON['message'];

						err_disp = err_statusCode + '\n' + err_is + '\n' + err_msg;
					} else {
						err_disp = jqXHR.responseText;
					}
					
					alert('Error:\n' + err_disp);

					/*<div id="movie_list_status" class="alert alert-info fade show" role="alert">
						<span class="spinner spinner-border spinner-border-md" role="status" aria-hidden="true"></span>
						<span id="movie_list_status_msg">Movies loading...</span>
					</div>*/
				},
				complete : function() {

					console.log('complete event');

				}
			});
		});
	}
	,
	save_one : function () {
		/** Potential use for single field save */
	}
}).init();
