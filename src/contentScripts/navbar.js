var Coon = Coon || {};
Coon.Navbar = (function(Navbar, Utils){
	'use strict';

	// ---------------------------------------
	// Private variables
	// ---------------------------------------

	// Elements
	var $navbarWrapper, $navbar, $userList, $hoverAreaTrigger, $filterInput ;
	
	// State
	var _hasLoaded = false , 
		_isAdmin   = false ;

	// variables
	var _afterLoadEventQueue  = [] ,
		_afterLoginEventQueue = [] ;

	var _allUsers = [];

	// Rendering
	var _template ;

	
	// ---------------------------------------
	// Public Variables
	// ---------------------------------------

	// Public Elements
	

	/// See #Navbar.afterLogin
	Navbar.redirectUrl = undefined; 

	var _baseUrl = Utils.getBaseUrl();	


	// ---------------------------------------
	// Public Methods
	// ---------------------------------------

	// Inits 
	Navbar.init = function () {
		renderNavbar()
			.then(addEventHandlers)
			.then(loadData)
			.then(addAfterLoginListeners) ;
	} ;

	/// Functions that run after the navbar is done loading
	Navbar.afterLoad = function(fn) {
		if(_hasLoaded)  {
			fn();
		}

		_afterLoadEventQueue.push(fn);
	};

	/// Intercepts the normal login link and runs the function passed in.
	/// That function can set the variable Navbar.redirectUrl 
	/// to redirect to a certain page.
	Navbar.afterLogin = function(fn) {
		_afterLoginEventQueue.push(fn);
	} ;

	// ---------------------------------------
	// Private methods
	// ---------------------------------------

	var renderNavbar = function(){
		var views = chrome.extension.getURL('src/contentScripts/views.html');
		return $.get(views).then(function(data){
		    var $html = $('<div>').html(data);
		    var source = $html.find('[data-template-id="coon-navbar"]').html();
		    _template = Handlebars.compile(source);

		    var viewModel = createViewModel();
		    var html = _template(viewModel);

		    $('<div id="coon-navbar">')
		    	.append(html)
		    	.prependTo('body');

	    	$navbarWrapper = $('#coon-navbar');
	    	$navbar = $('#coon-navbar-content');
	    	$userList = $('#coon-navbar-user-list');
	    	$hoverAreaTrigger = $('#coon-navbar-hoverarea-trigger');
	    	$filterInput = $('#coon-filter-users');
		});
	};

	var addEventHandlers = function(){
		initHoverArea();

        $filterInput.on('keyup', function(){
        	filterUserList()	;
        } );
	};

	var initHoverArea = function(){
		$(document).on('mousemove.showtrigger', function(e){
			if(!$hoverAreaTrigger.hasClass('active')){
				if(e.pageX < 100) {
					$hoverAreaTrigger.addClass('visible');
				}else{
					$hoverAreaTrigger.removeClass('visible');
				}
			}
		});

		// Trigger area shows the navbar on hover
		$($hoverAreaTrigger).hover(function(){
	        $navbarWrapper.addClass('active');
	    }, function(){
	        setTimeout(function(){
	            if(!$navbar.is(':hover')){
	                $navbarWrapper.removeClass('active'); 
	            }
	        },50);
	    });

	    $navbar.mouseleave(function(){
            $navbarWrapper.removeClass("active");
        });
	}

	var filterUserList = function(){
		var input = $filterInput.val().toLowerCase();

		if(input==="") { reRenderUsers() ; }

		var users = _allUsers.filter(function(user){
			if(user.name.toLowerCase().indexOf(input)>-1 || 
				user.pnr.toLowerCase().indexOf(input)>-1 || 
				user.county.toLowerCase().indexOf(input)>-1) {

				return true;
			}

			return false;
		});

		reRenderUsers({users:users});

	};

	var createViewModel = function(viewModel){
		var defaultViewModel = {
		    	isAdmin  : _isAdmin , 
		    	homeLink : _baseUrl ,
		    	users 	 : _allUsers
		    };

		if(viewModel) {
			return $.extend({}, defaultViewModel, viewModel);
		}

		return defaultViewModel;
	};

	var reRenderUsers = function(viewModel){
		var $html = $(_template(viewModel));
		$userList.html($('#coon-navbar-user-list', $html).html());
	};

	var loadData = function(){
		$.get(_baseUrl)
			.then(retrieveUsers)
			.then(setAsLoaded);
	};

	var retrieveUsers = function(htmlResponse) {
		
	    var html = $("<div></div>").html(htmlResponse),
	        rows = html.find('tr');

	    _isAdmin = html.find('.container>h2').children().length === 0;

	    if(!_isAdmin){
			_allUsers = $.map(rows, function(row){
		        var tds = $(row).find('td');
		        if(tds.length>0){
		            return {
		                pnr 	: tds.eq(0).text().trim(),
		                link	: tds.eq(0).find('a').attr('href'),
		                name	: tds.eq(1).text().trim(),
		                county	: tds.eq(2).text().trim(),
		                logins	: parseInt(tds.eq(3).text().trim())
		            } ;
		        }
		    });
	    }else {
	    	_allUsers = $.map(rows, function(row){
		        var tds = $(row).find('td');
		        if(tds.length>0){

		        	var auths = tds.eq(3).find('ul li').map(function(){
		        		return $(this).text().trim();
		        	});
		            return {
		                link	: tds.eq(1).find('a').attr('href'),
		                name	: tds.eq(1).text().trim(),
		                auths	: auths,
		                logins	: parseInt(tds.eq(4).text().trim())
		            } ;
		        }
		    });
	    }

	    sortUsers();
	    var viewModel = createViewModel();
	    reRenderUsers(viewModel);

	};

	var sortUsers = function(userList, attr) {
		userList = userList || _allUsers;
		attr = attr || 'logins' ;

		userList.sort(function(a,b) {
			a=a[attr];
			b=b[attr]; 
			return a===b ? 0 : a > b ? -1 : 1; 
		});
	};

	// sets the navbar as loaded and run afterload event queues.
	var setAsLoaded = function() {
		_hasLoaded = true;
		_afterLoadEventQueue.forEach(function(fn){
			fn();
		});
	};

	var addAfterLoginListeners = function() {
		Navbar.afterLoad(function(){
			$(document).on('click', '#coon-navbar-user-list a', function(e){
				if(_afterLoginEventQueue.length < 1) { return; } 

				e.preventDefault();
				var $a = $(this),
				linkUrl = $a.prop('href');

	        	showLoadingLink($a);
		        	
		        var login = $.get(linkUrl);
		        var cbPromises = [];

		        _afterLoginEventQueue.forEach(function(fn){
		        	var cbDeferred = $.Deferred();
		        	cbPromises.push(cbDeferred);

	        		// Queues event after login
        			login.then(function(data){
        				// retval = the returnvalue of the eventqueue function 
        				var retVal = undefined;

        				if(!Navbar.redirectUrl){
	        				retVal = fn.apply(this, [data]);
        				} else {
	        				$.get(Navbar.redirectUrl).then(function(data){
	        					retVal = fn.apply(this, [data]);
        					});
		        		}

	        			// If the returnvalue is a promise, 
	        			// wait for it to be resolved before resolving the
	        			// event queue function
		        		if(retVal !== undefined && retVal.promise){
		        			retVal.done(function(){
		        				cbDeferred.resolve();		        				
		        			});
		        		}else{
			        		// resolves the promise
	        				cbDeferred.resolve();		        			
		        		}

    				});
		        });
		        $.when.apply($, cbPromises).done(function(){
		        	// all afterLoginEvents have been loaded, reset the array
		        	_afterLoginEventQueue = [];

		        	// redirect to the redirectUrl
		        	var location = Navbar.redirectUrl || linkUrl;
	        		window.location.replace(location);

	        		// If there is a hash in the url then reload the page
	        		if(window.location.hash!=="") {
	        			window.location.reload();
	        		}
		        });
			});
		});

	};


	// Shows loading animation
	var showLoadingLink = function($userLink){
		var svgUrl = chrome.extension.getURL('src/img/ball.svg');
		var $loadingIcon = $(
			'<div id="coon-loading-wrapper" style="display:none;">' +
				'<div class="coon-shadow"></div>' +
				'<div>' +
					'<div class="coon-loading"/>' +
					'<img src="' + svgUrl + '"/>' +
				'</div>'	+
				'<div id="coon-loading-text">Loading</div>' +
			'</div>'
		);
		$navbar.append($loadingIcon);
		$loadingIcon.fadeIn('fast');
	};


	// Return this object
	return Navbar;

})(Coon.Navbar || {}, Coon.Utils); 
