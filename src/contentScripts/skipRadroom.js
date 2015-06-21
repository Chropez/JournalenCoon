var Coon = Coon || {};
Coon.SkipRadRoom = (function(SkipRadRoom, Navbar, Utils){
	'use strict';

	// Public methods
	SkipRadRoom.init = function(){
		var baseUrlObj = Utils.getBaseUrl(true);
		if(baseUrlObj.isAdmin) return; // No Radroom to skip when you're admin
		
		interceptLinks();
	};

	// Private methods
	var interceptLinks = function() {
		Navbar.afterLogin(function(data){
            var html = $($.parseHTML(data)),
            btnLink  = $('#RespiteOffButton', html).prop('href');

            Navbar.redirectUrl = btnLink;
		});
	};

	return SkipRadRoom;

})(Coon.SkipRadRoom || {}, Coon.Navbar, Coon.Utils);