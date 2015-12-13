// Uncomment "fancy-settings"  are used
// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

var Coon = Coon || {};

Coon.Background = (function(){
    'use strict';

    return {
        init: init ,
        getSettings : getSettings,
        getEnvironments: getEnvironments
    };

    function init() {
      console.log('run init');

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
        chrome.tabs.onUpdated.addListener(function ( tabId, changeInfo, tab) {
          if (tab.url !== undefined && changeInfo.status === "complete") {
            injectContentScripts(tab);
          }
        });

        chrome.tabs.onCreated.addListener(function( tab ){
          if (tab.url !== undefined && changeInfo.status === "complete") {
            injectContentScripts(tab);
          }
        });

    }

    //
    // "css": [
    //   "src/contentScripts/navbar.css"
    // ],
    //
    // "js": [
    //   "bower_components/jquery/dist/jquery.min.js",
    //   "bower_components/handlebars/handlebars.min.js",
    //   "src/contentScripts/utils.js",
    //   "src/contentScripts/navbar.js",
    //   "src/contentScripts/rememberLastPage.js",
    //   "src/contentScripts/keepMeLoggedIn.js",
    //   "src/contentScripts/journalComments.js",
    //   "src/contentScripts/main.js"
    // ]
    function injectContentScripts(tab) {
      getEnvironmentsDeferred().then((envs) => {
        debugger;
        var urlMatchesEnvs = true;
        if(urlMatchesEnvs) {
          chrome.tabs.executeScript(tab.id,
            [
              { code: 'console.log("hello");',  runAt: 'document_end' }
            ]);
        }
      });
    }


    function getEnvironmentsDeferred() {
      var deferred = $.Deferred();
      getEnvironments(function(envs){
        deferred.resolve(envs);
      });
      return deferred;
    }

    function getSettings(sendResponse) {
        chrome.storage.sync.get({ settings: Coon.Settings }, function (res) {
            var settings = $.extend(settings, Coon.Settings, res.settings);
            sendResponse( settings );
        });
    }

    function getEnvironments(sendResponse) {
      $.getJSON('defaults/environments.json').then(function(defaultEnvs){
        chrome.storage.sync.get({ environments: defaultEnvs }, function (res) {
          sendResponse(mergeEnvironments(defaultEnvs, res.environments));
        });
      });

    }

    function mergeEnvironments(defaultEnvs, userEnvs) {
      var envs = [];
      defaultEnvs.forEach(function(env){
        // find userEnv with same ID
        var userEnv = $.grep(userEnvs, function(e) { return e.id === env.id ; });
        if(userEnv.length > 0) {
          var mergedEnv = $.extend(mergedEnv, env, userEnv[0]);
          envs.push(mergedEnv);
        }else{
          envs.push(env);
        }
      });
      return envs;
    }

})();

Coon.Background.init();

b = new Background();

console.log(b.area());
