// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

(function(){

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
});

/* Not necessary yet
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        //console.log("This is a first install!");
    }else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        if(details.previousVersion < "0.4.0") {
        	chrome.storage.sync.clear(function(){
                debugger;
                chrome.storage.sync.get('settings', function(a){
                    debugger;
                });
            });
        }
        
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});*/

})();


