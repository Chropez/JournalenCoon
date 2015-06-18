(function() {
	'use strict';
	chrome.runtime.sendMessage({ action : 'navbar' }, function(settings) {
		if( settings.navbarEnabled ){
        	Coon.Navbar.init();
		}

		if( settings.skipRadRoomEnabled ){
			Coon.SkipRadRoom.init();
		}
	});
	
})();