var Coon = Coon || {};

Coon.KeepMeLoggedIn = (function(kmli, Utils){
	var _baseUrl = Utils.getBaseUrl(true);
	var _pollUrl = {
		user  : _baseUrl.url + 'Dashboard/Index',
		admin : _baseUrl.url + 'Dashboard/Index'
	};

	var _pollInterval = 15 * 60 * 1000 ;  //15 minutes

	kmli.init = function(){
		if(!_baseUrl.isFromJournalen) { return ; } //Do nothing, the user might not be logged in
		if(_baseUrl.isAdmin) {
			startPolling(_pollUrl.admin);
		}

		startPolling(_pollUrl.user);
	};

	/*jshint unused:false*/
	var startPolling = function(url){
		setInterval(function(){
			$.get(url);
		}, _pollInterval);
	};

	return kmli ;

})(Coon.KeepMeLoggedIn || {}, Coon.Utils);
