var showErrorsModule = angular.module('angular.bootstrap.showErrors', []);

showErrorsModule.config( function() {
	$('.form-control').tooltip( { "trigger": "manual", "animation": false } );
});

showErrorsModule.directive( "errorMessage", function($log, $interpolate) {
	var linkFn = function(scope, el, attrs, formCtrl) {
		var rootOfInputGroup = $( el ).parents( '.form-group, div.checkbox' );
		var inputEl = rootOfInputGroup[ 0 ].querySelector( '.form-control[name], input[type=checkbox]' );
		var inputNgEl = angular.element( inputEl );
		var inputName = $interpolate( inputNgEl.attr('name') || '' )( scope );
		
		var validatorName = attrs.name;
		var errorMessage = $( el ).text();
		$log.info( errorMessage );
		
		var showHideMessage = function(blur) {
			var input = formCtrl[ inputName ];
			
			if ( input && input.$error && ( input.$touched || blur == true ) ) {
				var currentMessage = $( inputNgEl ).attr( 'data-original-title' );
				
				if ( input.$error[ validatorName ] == true ) {					
					if ( currentMessage.includes( errorMessage ) == false ) {
						var newMessage = currentMessage + " " + errorMessage;
						$( inputNgEl ).attr( 'data-original-title', newMessage ).tooltip( "show" );
					}					
				}
				else {
					var newMessage = currentMessage.replace( errorMessage, "" ).trim();
					$( inputNgEl ).attr( 'data-original-title', newMessage ).tooltip( newMessage.length > 0 ? "show" : "hide" );
				}
			}
			else {
				$( inputNgEl ).attr( 'data-original-title', "" ).tooltip( "hide" );
			}
		}
		
		inputNgEl.bind( "blur", function() { showHideMessage( true ) } );
		
		scope.$watch( 
			function() {
				return formCtrl[ inputName ].$error;
			},
			showHideMessage,
			true );
	}
	
	return {
		restrict: "E",
		require : '^form',
		scope: {},
		compile : function(elem, attrs) {
			var rootDiv = $( elem ).closest( '.form-control[name], input[type=checkbox]' );			
			if ( !rootDiv ) {
				throw "show-errors element does not have the 'form-group' or 'checkbox' class";
			}
			
			return linkFn;
		}		
	}
});

showErrorsModule.directive( 'showErrors', [ '$timeout', 'showErrorsConfig', '$interpolate', function( $timeout, showErrorsConfig, $interpolate ) {
		var getTrigger = function(options) {
			var trigger = showErrorsConfig.trigger;
			if ( options && ( options.trigger != null ) ) {
				trigger = options.trigger;
			}
			
			return trigger;
		};
		
		var getShowSuccess = function(options) {
			var showSuccess = showErrorsConfig.showSuccess;
			if ( options && ( options.showSuccess != null ) ) {
				showSuccess = options.showSuccess;
			}
			
			return showSuccess;
		};
		
		var linkFn = function(scope, el, attrs, formCtrl) {
			var blurred = false;
			var options = scope.$eval( attrs.showErrors );
			var showSuccess = getShowSuccess( options );
			var trigger = getTrigger( options );
			
			var inputEl = el[ 0 ].querySelector( '.form-control[name], input[type=checkbox]' );
			var inputNgEl = angular.element( inputEl );
			var inputName = $interpolate( inputNgEl.attr('name') || '' )( scope );
			if ( !inputName ) {
				throw "show-errors element has no child input elements with a 'name' attribute and a 'form-control' class";
			}
			
			var feedback = el.find( ".form-control-feedback" );
			var hasFeedback = feedback && feedback.length > 0;
			
			var toggleClasses = function(invalid) {
				el.toggleClass('has-error', invalid);
				if ( showSuccess ) {
					el.toggleClass( 'has-success', !invalid );
				}
				
				var error = el.hasClass( "has-error");
				var success = el.hasClass( "has-success");
				
				if ( hasFeedback ) {
					feedback.removeClass( "glyphicon-ok" );
					feedback.removeClass( "glyphicon-remove" );
					
					if ( error ) {
						el.addClass( "has-feedback" );
						feedback.addClass( "glyphicon-remove" );
					}
					else if ( success ) {
						el.addClass( "has-feedback" );
						feedback.addClass( "glyphicon-ok" );
					}
				}
				else {
					el.removeClass( "has-feedback" );
				}
			};
			
			inputNgEl.bind( trigger, function() {
				blurred = true;
				return toggleClasses(formCtrl[inputName].$invalid);
			});
			
			scope.$watch( function() {
				return formCtrl[ inputName ] && formCtrl[ inputName ].$invalid;
			}, function( invalid ) {
				if ( blurred ) {
					return toggleClasses( invalid );
				}
				else {
					return;
				}
			});
			
			scope.$on( 'show-errors-check-validity', function() {
				return toggleClasses( formCtrl[ inputName ].$invalid );
			});
			
			scope.$on( 'show-errors-reset', function() {
				return $timeout( function() {
					el.removeClass( 'has-error' );
					el.removeClass( 'has-success' );
					el.removeClass( "has-feedback" );
					feedback.removeClass( "glyphicon-ok" );
					feedback.removeClass( "glyphicon-remove" );
					return blurred = false;
				}, 0, false);
			});
			
			return toggleClasses;
		};
		
		return {
			restrict : 'A',
			require : '^form',
			compile : function(elem, attrs) {
				if ( attrs[ 'showErrors' ].indexOf( 'skipFormGroupCheck' ) === -1 ) {
					if ( !( elem.hasClass( 'form-group' ) || elem.hasClass( 'input-group' ) || elem.hasClass( 'checkbox' ) ) ) {
						throw "show-errors element does not have the 'form-group', 'input-group', or 'checkbox' class";
					}
				}
				return linkFn;
			}
		};
	} ]);

showErrorsModule.provider( 'showErrorsConfig', function() {
	var _showSuccess = false;
	var _trigger = 'blur';
	
	this.showSuccess = function(showSuccess) {
		return _showSuccess = showSuccess;
	};
	
	this.trigger = function(trigger) {
		return _trigger = trigger;
	};
	
	this.$get = function() {
		return {
			showSuccess : _showSuccess,
			trigger : _trigger
		};
	};
});