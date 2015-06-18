var Coon = Coon || {};
Coon.Navbar = (function(Navbar, Utils){
	'use strict';

	// ---------------------------------------
	// Private variables
	// ---------------------------------------

	// Elements
	var _navbar, _navbarWrapper ; 
	
	// State
	var _isVisible = false , 
		_hasLoaded = false ; // Not used yet

	// variables
	var _baseUrl = "/",
		_afterLoadEventQueue = [];

	
	// ---------------------------------------
	// Public Variables
	// ---------------------------------------

	// Public Elements
	Navbar.navbarUserList ;
	
	// Public state
	Navbar.isAdmin = false ;	


	// ---------------------------------------
	// Public Methods
	// ---------------------------------------

	// Inits 
	Navbar.init = function () {
		createElements();
		findBaseUrl();
		loadData();
	} ;

	Navbar.afterLoad = function(fn) {
		if(_hasLoaded) 
			fn();

		_afterLoadEventQueue.push(fn);
	};


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
	            if(!_navbar.is(':hover'))
	                _navbarWrapper.removeClass('active');     
	        },100);
	    });

	    var overlay = $('<div id="coon-navbar-overlay"></div>').prependTo(_navbarWrapper);

	    _navbar = $('<div id="coon-navbar-content"></div>')
	        .prependTo(_navbarWrapper)
	        .mouseleave(function(){
	            _navbarWrapper.removeClass("active");
	        });

	    var coonHeader = $('<div id="coon-navbar-content-header"><div></div></div>').appendTo(_navbar);
	} ;

	var findBaseUrl = function(){
		var vars = 	Utils.getWindowVariables(["Jpn.Shared.BaseUrl", "Jpn.Admin.Shared.BaseUrl"]);
		_baseUrl = 	vars ? 
                    vars["Jpn.Shared.BaseUrl"] ? 
                        vars["Jpn.Shared.BaseUrl"] : 
                        vars["Jpn.Admin.Shared.BaseUrl"] ? 
                            vars["Jpn.Admin.Shared.BaseUrl"] : 
                            _baseUrl
                    : _baseUrl ;
	};

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
	            }
	        }
	    });
	    
	    return users;
	};

	var renderUsers = function(users) {
		Navbar.navbarUserList = $('<ul id="coon-navbar-user-list"></ul>').appendTo(_navbar);
	    users = users.sort(function(a,b) { var a=a.logins, b=b.logins; return a==b?0: a>b ? -1:1; });
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



	// Return this object
	return Navbar;

})(Coon.Navbar || {}, Coon.Utils); 
