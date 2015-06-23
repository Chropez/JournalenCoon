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
		//createElements();
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

        $filterInput.on('keyup', function(){
        	filterUserList()	;
        } );
	};

	var filterUserList = function(){
		var input = $filterInput.val().toLowerCase();

		if(input==="") reRenderUsers();

		var users = _allUsers.filter(function(user){
			if(user.name.toLowerCase().indexOf(input)>-1 
				|| user.pnr.toLowerCase().indexOf(input)>-1
				|| user.county.toLowerCase().indexOf(input)>-1) {

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

		if(viewModel) 
			return $.extend({}, defaultViewModel, viewModel);

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
			a=a[attr], b=b[attr]; 
			return a===b ? 0 : a > b ? -1 : 1; 
		});
	};

	var setAsLoaded = function() {
		_hasLoaded = true;
		_afterLoadEventQueue.forEach(function(fn){
			fn();
		});
	};

	var addAfterLoginListeners = function() {
		Navbar.afterLoad(function(){
			$('a', $userList).on('click', function(e){
				if(_afterLoginEventQueue.length < 1) { return; } 

				e.preventDefault();
				var $a = $(this),
				linkUrl = $a.prop('href');

	        	//showLoadingLink($a);

		        var login = $.get(linkUrl);
		        var cbPromises = [];

		        _afterLoginEventQueue.forEach(function(fn){
		        	var cbDeferred = $.Deferred();
		        	cbPromises.push(cbDeferred);

        			login.then(function(data){
        				if(!Navbar.redirectUrl){
	        				fn.apply(this, [data]);
	        				cbDeferred.resolve();
        				} else {
	        				$.get(Navbar.redirectUrl).then(function(data){
	        					fn.apply(this, [data]);		
		        				cbDeferred.resolve();
        					});
		        		}
    				});
		        });


		        $.when.apply($, cbPromises).done(function(){
			        window.location.replace(Navbar.redirectUrl || linkUrl);
		        });
			});
		});

	};


	// Return this object
	return Navbar;

})(Coon.Navbar || {}, Coon.Utils); 
