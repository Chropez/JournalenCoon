(function() {
	'use strict';
	chrome.runtime.sendMessage({ action : 'settings' }, function(settings) {
		if( settings.navbarEnabled ){
        	Coon.Navbar.init();

			if( settings.rememberLastPageEnabled ) {
				Coon.RememberLastPage.init();
			}
		}

		if( settings.keepMeLoggedInEnabled ){ 
			Coon.KeepMeLoggedIn.init();
		}


		if( settings.journalCommentAutoEnabled ){ 
			Coon.JournalComments.init();
		}
	
	});
})();
