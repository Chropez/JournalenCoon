console.log('topbar loaded bg');
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
   	var action = request.action ;

   	if(!action) return true;

   	switch(action) {
	    case 'navbar':
	    	chrome.storage.sync.get({ settings: Coon.Settings }, function (res) {
    			sendResponse( res.settings );
	    	});
	    	return true;
	        break;
	    default:
	        return true;
	}

});