(function(){
	// Will be logged as lastPage : { <tabId> : 'http://local.jpn/login' } }
	var _lastPage = {} ; 

	var _urlsToIgnore = [
		'',
		'LoggedOut/TimedOut'
	];

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	   	if(!request.action || (request.action && request.action !== 'rememberThisPage')) {
	   		return false;
	   	}

	   	if(!request.baseUrl.isFromJournalen){
			sendResponse( { lastPage : _lastPage[sender.tab.id] });
	   		return true;
	   	}


	   	var fullBaseUrl = request.baseUrl.url ;
	   	
	   	var urlsToIgnore = _urlsToIgnore.map(function(url) {
	   		return fullBaseUrl + url;
	   	});

		if($.inArray(sender.tab.url, urlsToIgnore) === -1) {
			_lastPage[sender.tab.id] = sender.tab.url;
		}
		 
		sendResponse( { lastPage : _lastPage[sender.tab.id] });

	});

})();
