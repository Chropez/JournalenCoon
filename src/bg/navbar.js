console.log('topbar loaded bg');
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
   	var action = request.action ;

   	if(!action) return true;

   	switch(action) {
	    case 'navbar':
	    	chrome.storage.sync.get('settings', function (settings) {
    			sendResponse();
	    	});

	        break;
	    default:
	        return true;

        sendResponse();

	}

    sendResponse({hi:'hello from topbar'});
});