(function() {
	'use strict';
	chrome.runtime.sendMessage({ action : 'settings' }, function(settings) {
		if( settings.navbarEnabled ){
        	Coon.Navbar.init();

			if( settings.skipRadRoomEnabled ){
				Coon.SkipRadRoom.init();
			}

			if( settings.rememberLastPageEnabled ) {
				Coon.RememberLastPage.init();
			}
		}

		if( settings.keepMeLoggedInEnabled ){ 
			Coon.KeepMeLoggedIn.init();
		}
	
	});
})();

/*
var link = chrome.extension.getURL('src/contentScripts/views.html');
var html = $.get(link).then(function(data){

    var $html = $($.parseHTML(data));
    var source = $html.filter("#coon-navbar").html();
    var template = Handlebars.compile(source);

    var name = { name : 'Christopher'};
    var html = template(name);

    $('#coon-navbar-content').prepend(html);

});*/

