var Coon = Coon || {};
Coon.SkipRadRoom = (function(SkipRadRoom, Navbar){
	'use strict';

	// Private vars

	// Public vars

	// Public methods
	SkipRadRoom.init = function(){
		Navbar.afterLoad(init); // Run only after navbar has loaded
	};

	// Private methods
	var init = function(){
		if(Navbar.isAdmin) return; // No Radroom to skip when you're admin

		interceptLinks();
	};

	var interceptLinks = function() {
		$('a', Navbar.navbarUserList).on('click', function(e){
	        e.preventDefault();
	        var $this = $(this),
	         thisLink = $this.prop('href');

	        showLoadingLink($this);

	        $.get(thisLink, function(data) {
	            var html = $($.parseHTML(data));
	            var btnLink = $('#RespiteOffButton', html).prop('href');
	            window.location.replace(btnLink);
	        }).then(function(){
				hideLoadingLink($this) ;
	        });



	    });
	};

	var showLoadingLink = function(element) {
		//todo
	};

	var hideLoadingLink = function(element){
		//todo
	};

	return SkipRadRoom;

})(Coon.SkipRadRoom || {}, Coon.Navbar);