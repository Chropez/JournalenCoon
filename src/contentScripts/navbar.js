var Coon = Coon || {};
Coon.Navbar = (function(Navbar, Utils){
	'use strict';

	// ---------------------------------------
	// Private variables
	// ---------------------------------------

	// Elements
	var _navbar, _navbarWrapper ; 
	
	// State
	var _hasLoaded = false ; // Not used yet

	// variables
	var _afterLoadEventQueue = [];
	var _afterLoginEventQueue = [];

	
	// ---------------------------------------
	// Public Variables
	// ---------------------------------------

	// Public Elements
	Navbar.navbarUserList = undefined;
	
	Navbar.isAdmin = false ;

	/// See #Navbar.afterLogin
	Navbar.redirectUrl = undefined; 

	var _baseUrl = Utils.getBaseUrl();	


	// ---------------------------------------
	// Public Methods
	// ---------------------------------------

	// Inits 
	Navbar.init = function () {
		createElements();
		loadData();
		addAfterLoginLitseners();
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

	var createElements = function() {
	    _navbarWrapper = $('<div id="coon-navbar"></div>').prependTo('body');

	    var hoverArea = $('<div id="coon-navbar-hoverarea">').prependTo(_navbarWrapper);
	    var hoverAreaTrigger = $('<div id="coon-navbar-hoverarea-trigger">').appendTo(hoverArea);
	    
	    hoverAreaTrigger.hover(function(){
	        _navbarWrapper.addClass('active');
	    }, function(){
	        setTimeout(function(){
	            if(!_navbar.is(':hover')){
	                _navbarWrapper.removeClass('active');     
	            }
	        },100);
	    });

	    var overlay = $('<div id="coon-navbar-overlay"></div>').prependTo(_navbarWrapper);

	    _navbar = $('<div id="coon-navbar-content"></div>')
	        .prependTo(_navbarWrapper)
	        .mouseleave(function(){
	            _navbarWrapper.removeClass("active");
	        });

	    var coonHeader = $('<a href="' + _baseUrl + '" id="coon-navbar-content-header"><div id="coon-navbar-content-header-background"></div></a>').appendTo(_navbar);
	} ;


	var loadData = function(){
		$.get(_baseUrl)
			.then(retrieveUsers)
			.then(renderUsers)
			.then(setAsLoaded);
	};

	var retrieveUsers = function(htmlResponse) {
		
	    var html = $("<div></div>").html(htmlResponse),
	        rows = html.find('tr');

	    Navbar.isAdmin = html.find('.container>h2').children().length === 0;

	    var users = $.map(rows, function(row){
	        var tds = $(row).find('td');
	        var link = Navbar.isAdmin 
	                    ? tds.eq(1).find('a').attr('href') 
	                    : tds.eq(0).find('a').attr('href');
	        if(tds.length>0){
	            return {
	                pnr 	: tds.eq(0).text().trim(),
	                link	: link,
	                name	: tds.eq(1).text().trim(),
	                county	: tds.eq(2).text().trim(),
	                logins	: parseInt(tds.eq(3).text().trim())
	            } ;
	        }
	    });
	    
	    return users;
	};

	var renderUsers = function(users) {
		Navbar.navbarUserList = $('<ul id="coon-navbar-user-list"></ul>').appendTo(_navbar);
	    users = users.sort(function(a,b) { a=a.logins, b=b.logins; return a===b?0: a>b ? -1:1; });
	    $.each(users, function(i, user){
	        var li = $('<li>');
	        var title = ""+ user.pnr + "\nLän: " + user.county + "\nInloggningar: " + user.logins ;
	        var link = $('<a href="' + user.link + '" style="margin-right:20px" title="' + title + '">' + user.name + '</a>');
	        li.append(link).appendTo(Navbar.navbarUserList);
	    });

	};

	var setAsLoaded = function() {
		_hasLoaded = true;
		_afterLoadEventQueue.forEach(function(fn){
			fn();
		});
	};

	var addAfterLoginLitseners = function() {
		Navbar.afterLoad(function(){
			$('a', Navbar.navbarUserList).on('click', function(e){
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



		        /*, function(data) {
		            var html = $($.parseHTML(data));
		            var btnLink = $('#RespiteOffButton', html).prop('href');
					var promise = $.get()
				}	*/
	};

	// Return this object
	return Navbar;

})(Coon.Navbar || {}, Coon.Utils); 
