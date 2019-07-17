/** movie-admin.js */
var movie_admin = ( typeof (movie_admin) === 'object' ) ? movie_admin : {};
(movie_admin = {
	init : () => {
		$.ajax({
			url: '/.netlify/functions/at_get_movie?recid=all',
			dataType: 'json'
		}).done( function ( resp, textStatus, jqXHR ) {
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

					var movie_rating_stars = movie_admin.seeing_stars(movie_rating);

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
							'<div class="movie_title form-field-container">' +
								'<label for="movie_title_' + movie_recid + '">Title <small class="text-muted">(50 characters or less)</small></label>' +
								'<input id="movie_title_' + movie_recid + '"' +
									' value="' + movie_title + '"' +
									' data-fldname="Title"' +
									' data-ogval="' + movie_title + '"' +
									' class="form-control"' +
									' type="text" minlength="1" maxlength="50"' + 
									'>' +
							'</div>' +
							'<div class="movie_details">' +
								'<div class="movie_year form-field-container">' +
									'<label for="movie_year_' + movie_recid + '">Year <small class="text-muted">(from 1800 to 2100)</small></label>' +
									'<input id="movie_year_' + movie_recid + '"' +
										' value="' + movie_year + '"' +
										' data-fldname="Year"' +
										' data-ogval="' + movie_year + '"' +
										' class="form-control"' +
										' type="number" min="1800" max="2100"' + 
										'>' +
								'</div>' +
								'<div class="movie_length form-field-container">' +
									'<label for="movie_length_' + movie_recid + '">Length <small class="text-muted">(in minutes)</small></label>' +
									'<input id="movie_length_' + movie_recid + '"' +
										' value="' + movie_length + '"' +
										' data-fldname="Length"' +
										' data-ogval="' + movie_length + '"' +
										' class="form-control"' +
										' type="number" min="0" max="500"' + 
										'>' +
								'</div>' +
								'<div class="movie_rating form-field-container">' +
									'<label for="movie_rating_' + movie_recid + '">Rating</label>' +
									movie_rating_stars +
									'<input id="movie_rating_' + movie_recid + '"' +
										' value="' + movie_rating + '"' +
										' data-fldname="Rating"' +
										' data-ogval="' + movie_rating + '"' +
										' class="form-control"' +
										' type="number" min="1" max="5" hidden' + 
										'>' +
								'</div>' +
								'<div class="movie_format form-field-container">' +
									'<label for="movie_format_' + movie_recid + '">Format</label>' +
									// '<select id="movie_format_' + movie_recid + '" class="custom-select"' +
									'<select id="movie_format_' + movie_recid + '" class="form-control"' +
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
	ready : () => {
		$('#movie_list_status').alert('close');

		movie_admin.add_movie_click();
		$('.add-movie').prop('disabled', false);

		
		movie_admin.track_changes_field();
		movie_admin.rating_hover();
		movie_admin.rating_click();
		// movie_admin.save_one_click();
		movie_admin.save_all_click();
	}
	,
	add_movie_click : () => {
		$('.add-movie').click( function (e) {
			movie_admin.add_movie();

			$('input').first().focus();
		});
	}
	,
	add_movie : () => {
		var movie_recid = Date.now();
		var movie_rating_stars = movie_admin.seeing_stars('1');

		var movie_listing = '<div class="movie_listing form-group" ' +
				'data-recid="' + movie_recid +'"' +
				// 'data-recid="new"' +
				'data-haschgs="false"' +
				'id="movie_listing_' + movie_recid + '"' +
				'class="movie_listing_new"' +
				'>' +
				// '<div class="movie_poster"></div>' +
				'<div class="movie_title form-field-container">' +
					'<label for="movie_title_' + movie_recid + '">Title <small class="text-muted">(50 characters or less)</small></label>' +
					'<input id="movie_title_' + movie_recid + '"' +
						' value=""' +
						' data-fldname="Title"' +
						// ' data-ogval="new_movie_' + movie_recid + '"' +
						' class="form-control"' +
						// ' placeholder="The Big Flick Title"' +
						' type="text" minlength="1" maxlength="50" required' + 
						'>' +
				'</div>' +
				'<div class="movie_details">' +
					'<div class="movie_year form-field-container">' +
						'<label for="movie_year_' + movie_recid + '">Year <small class="text-muted">(from 1800 to 2100)</small></label>' +
						'<input id="movie_year_' + movie_recid + '"' +
							' value=""' +
							' data-fldname="Year"' +
							// ' data-ogval="new_movie_' + movie_recid + '"' +
							' class="form-control"' +
							// ' placeholder="2019"' +

							/** Input type="number" has a number of undesirable side effects */
							// ' type="number" min="1800" max="2100" pattern="\\d{4}" required>' +
							
							/** This pattern is perfect but triggering the numeric keypad on mobile is perfecter */
							// ' type="text" pattern="\\d{4}" maxlength="4" required>' +
							
							/** Fun fact: This pattern will trigger the numeric keypad on mobile */
							' type="text" pattern="\\d*" maxlength="4" required' + 
							'>' +
					'</div>' +
					'<div class="movie_length form-field-container">' +
						'<label for="movie_length_' + movie_recid + '">Length <small class="text-muted">(in minutes)</small></label>' +
						'<input id="movie_length_' + movie_recid + '"' +
							' value=""' +
							' data-fldname="Length"' +
							// ' data-ogval="' + movie_length + '"' +
							' class="form-control"' +
							// ' placeholder="150"' +
							// ' type="number" min="0" max="500" minlength="1" maxlength="3" pattern="\\d{4}" required>' +
							' type="text" pattern="\\d*" maxlength="3" required' + 
							'>' +
					'</div>' +
					'<div class="movie_rating form-field-container">' +
						'<label for="movie_rating_' + movie_recid + '">Rating</label>' +
						movie_rating_stars +
						'<input id="movie_rating_' + movie_recid + '"' +
							' value="1"' +
							' data-fldname="Rating"' +
							// ' data-ogval="' + movie_rating + '"' +
							' class="form-control"' +
							' type="number" min="1" max="5" hidden required' + 
							'>' +
					'</div>' +
					'<div class="movie_format form-field-container">' +
						'<label for="movie_format_' + movie_recid + '">Format</label>' +
						// '<select id="movie_format_' + movie_recid + '" class="custom-select"' +
						'<select id="movie_format_' + movie_recid + '" class="form-control"' +
							' data-fldname="Format"' +
							// ' data-ogval="' + movie_format + '"' +
							'>' +
							// '<option selected>Open this select menu</option>' +
							'<option value="DVD">DVD</option>' +
							'<option value="Streaming" selected>Streaming</option>' +
							'<option value="VHS">VHS</option>' +
						'</select>' +
					'</div>' +
				'</div>' +
			'</div>'
		;

		$('#movie_admin_list').prepend(movie_listing);
	}
	,
	seeing_stars : (movie_rating) => {
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

		return movie_rating_stars;
	}
	,
	track_changes_field : () => {
		$('#movie_admin_list').on('input change', 'input', function (e) {
			var ogVal = $(this).attr('data-ogval');
			var currVal = $(this).val();

			/** If the current value isn't the original value, mark the field as changed */
			if (ogVal !== currVal) {
				$(this).addClass('valChg');

				/** Do some validation */
				var fld_name = $(this).attr('data-fldname');
				var fld_el = $(this)[0];
				
				/** https://developer.mozilla.org/en-US/docs/Web/API/ValidityState */
				// console.log(fld_el.validity);

				fld_el.setCustomValidity('');

				switch (fld_name) {
					case 'Title':
							var chk_title = $(this).val().length > 0 && $(this).val().length < 51;
					
							console.log('chk_title: ' + chk_title);
							
							if (!chk_title) {
								fld_el.setCustomValidity('Title must be 1 to 50 characters');
							} else {
								fld_el.setCustomValidity('');
							}
					break;
					case 'Year':
						/** Only allow numbers */
						// var fld_val = fld_val.replace(/[^0-9]+/g, '');
						var fld_val = utils.input_numbers_only(currVal);
						$(this).val(fld_val);

						var chk_yr = $(this).val().length === 4 && ( parseInt( $(this).val() ) >= 1800 && parseInt( $(this).val() ) <= 2100 );
					
						console.log('chk_yr: ' + chk_yr);
						
						if (!chk_yr) {
							fld_el.setCustomValidity('Must be a 4 digit number between 1800 and 2100');
						} else {
							fld_el.setCustomValidity('');
						}
					break;
					case 'Length':
						/** Only allow numbers */
						// var fld_val = fld_val.replace(/[^0-9]+/g, '');
						var fld_val = utils.input_numbers_only(currVal);
						$(this).val(fld_val);

						var chk_len = ( parseInt( $(this).val() ) >= 1 && parseInt( $(this).val() ) <= 999 );
					
						console.log('chk_len: ' + chk_len);
						
						if ( !chk_len ) {
							fld_el.setCustomValidity('Must be a 3 digit number greater than 1');
						} else {
							fld_el.setCustomValidity('');
						}
					break;
				}

				var fld_isValid = fld_el.checkValidity();

				if (!fld_isValid) {
					
					console.log(fld_el.validationMessage);

				}
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
			} else {
				$(this).removeClass('valChg').nextAll('.valChgMsg').remove();
			}

			movie_admin.track_changes_listing( $(this) );
		});
	}
	,
	track_changes_listing : (jqObj) => {
		var hasChgs = jqObj.closest('.movie_listing').find('input, select').hasClass('valChg');

		if (hasChgs) {
			jqObj.closest('.movie_listing').attr('data-haschgs', true);
		} else {
			jqObj.closest('.movie_listing').attr('data-haschgs', false);
		}

		movie_admin.save_all_check();
	}
	,
	rating_hover : () => {
		/** Have to use delegated approach to work with injected elements (e.g., new movie) */
		$('#movie_admin_list')
			.on('mouseenter', '.movie_rating_star', function (e) {
		
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
			})
			.on('mouseleave', '.movie_rating_star', function (e) {
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
	rating_click : () => {
		// $('.movie_rating_star').click( function (e) {
		$('#movie_admin_list').on('click', '.movie_rating_star', function (e) {
			var movie_rating_sel = $(this).attr('data-ratingstar');
			var movie_recid = $(this).closest('.movie_listing').attr('data-recid');
			
			/** Fire change event on associated input */
			$('#movie_rating_' + movie_recid).val(movie_rating_sel).change();

			var ogVal = $('#movie_rating_' + movie_recid).attr('data-ogval');
			var currVal = $('#movie_rating_' + movie_recid).val();

			/** If the current value isn't the original value, mark the field */
			/** Change colors on rating display to mimic input fields */
			if (ogVal !== currVal) {
				$(this).closest('.movie_rating_stars').addClass('valChg-colorsOnly');
			} else {
				$(this).closest('.movie_rating_stars').removeClass('valChg-colorsOnly');
			}

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
	save_one_check : () => {
		// check if fields associated to given save button have changed
	}
	,
	save_all_check : () => {
		if ( $('.valChg').length !== 0 ) {
			$('.save-all').prop('disabled', false);

			/** If an .msg_unsavedChgs isn't already present, add it */
			if ( $('#movie_admin_list_actions_msgs .msg_unsavedChgs').length === 0 ) {
				$('#movie_admin_list_actions_msgs').prepend('<small class="msg_saveStatus msg_unsavedChgs msg-warning">There are unsaved changes!</small>');
			}
		} else {
			$('.save-all').prop('disabled', true);
			$('#movie_admin_list_actions_msgs .msg_unsavedChgs').remove();
		}
	}
	,
	save_one_click : () => {
		$('.save_item').click( function (e) {
			$(this).prop('disabled', true);
			var movie_recid = $(this).attr('data-recid');

			movie_admin.save_one(movie_recid);
		});
	}
	,
	save_all_click : () => {
		$('.save-all').click( function (e) {
			$('.save-all').prop('disabled', true);

			movie_admin.save_all();
		});
	}
	,
	save_item : (movie_recid) => {
		var req_obj = {
			'ID': movie_recid
		};
		var req_obj_flds = {};
		var chgdFldsArr = $('#movie_listing_' + movie_recid).find('.valChg');

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

			req_obj_flds[fldName] = fldVal;
		});

		req_obj.fields = req_obj_flds;

		var req_str = JSON.stringify(req_obj);

		var saveItemProm = new Promise( function (promSuccess, promError) {
			$.ajax({
				url: '/.netlify/functions/at_update_movie',
				type: 'PATCH',
				contentType: 'application/json',
				data: req_str,
				success: function (resp, textStatus, jqXhr) {

					console.log('success event');

					/** Reset fields to unchanged style */
					$('#movie_listing_' + movie_recid).find('.valChg, .valChg-colorsOnly').removeClass('valChg valChg-colorsOnly');

					$(this).closest('.movie_rating_stars').removeClass('valChg-colorsOnly');

					promSuccess();
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
					
					promError();

					alert('Error:\n' + err_disp);
				},
				complete: function() {

					console.log('complete event');

				}
			});
		});

		return saveItemProm;
	}
	,
	save_one : (movie_recid) => {
		var saveItem = movie_admin.save_item(movie_recid);

		saveItem.then(
			function () {
				/** Flag an element so the message can be placed contextually */
				//

				movie_admin.status_msg('save_one_success');
			}, 
			function (errObj) {
				console.error(errObj);
			}
		);
	}
	,
	save_all : () => {
		$('#movie_admin_list_actions_msgs .msg_saveStatus').remove();

		$('#movie_admin_list_actions_msgs').prepend('<small class="msg_saveStatus msg_savingAllChgs msg-info">Saving all changes...</small>');

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

			var saveItem = movie_admin.save_item(movie_recid);

			saveItem.then(
				function () {
					if (idx+1 === chgdMoviesArr.length) {
						movie_admin.status_msg('save_all_success');
					}
				}, 
				function (errObj) {
					console.error(errObj);
				}
			);
		});
	}
	,
	status_msg : (status_msg) => {
		switch (status_msg) {
			case 'save_one_success':
				// 
			break;
			case 'save_one_error':
				// 
			break;
			case 'save_all_success':
				/** Remove any messages about save status */
				$('#movie_admin_list_actions_msgs .msg_saveStatus').remove();

				$('#movie_admin_list_actions_msgs').prepend('<small class="msg_saveStatus msg_chgsSaved msg-success">All changes saved.</small>');

				/** After specificed delay, fade the message, then remove from DOM */
				window.setTimeout( function () {
					$('#movie_admin_list_actions_msgs .msg_chgsSaved').fadeOut('slow', function (e) {
						$(this).remove();
					});
				}, 2000);
			break;
			case 'save_all_error':
				// 
			break;
		}
	}
}).init();
