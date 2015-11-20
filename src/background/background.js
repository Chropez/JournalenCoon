// Uncomment "fancy-settings"  are used
// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

var Coon = Coon || {};

Coon.Background = (function(){
    'use strict';

    return {
        init: init ,
        getSettings : getSettings
    };

    function init() {
        // Intecepts all messages
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {      
            
            var action = request.action ;
            if(!action) { return false; }

            switch(action) {
                case 'settings':
                    getSettings(sendResponse);
                    return true;
                default:
                    return false;
            }
        });
    }

    function getSettings(sendResponse) {
        chrome.storage.sync.get({ settings: Coon.Settings }, function (res) {
            var settings = $.extend(settings, Coon.Settings, res.settings);
            sendResponse( settings );
        });
    }

})();

Coon.Background.init();






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
