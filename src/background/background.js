var Coon = Coon || {};

Coon.Background = (function(Background){
    'use strict';
    const contentScripts = [
      'bower_components/jquery/dist/jquery.min.js' ,
      'bower_components/handlebars/handlebars.min.js' ,
      'src/content-scripts/utils.js' ,
      'src/content-scripts/navbar.js' ,
      'src/content-scripts/remember-last-page.js' ,
      'src/content-scripts/keep-me-logged-on.js' ,
      'src/content-scripts/journal-comments.js' ,
      'src/content-scripts/main.js'
    ];

    Background.init = function() {
        // Intecepts all messages
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

            var action = request.action ;
            if(!action) { return false; }

            switch(action) {
                case 'settings':
                    Background.getSettings(sendResponse);
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
          if (tab.url !== undefined) {
            injectContentScripts(tab);
          }
        });

    } ;

    /*jshint unused:false*/
    let injectContentScripts = function(tab) {
      getEnvironmentsPromise().then((envs) => {
        if(urlMatchesEnvs(tab.url, envs)) {
          chrome.tabs.insertCSS(tab.id, { file: 'src/content-scripts/navbar.css' });
          executeScript(tab.id, { code: 'console.info("Journalen Coon is injecting scripts...");'});
          contentScripts.forEach((script) => {
            executeScript(tab.id, { file: script });
          });
        }
      });
    } ;

    let executeScript = function(tabId, details) {
      var mergedDetails = $.extend(mergedDetails, details, { runAt: 'document_end'});
      chrome.tabs.executeScript(tabId, mergedDetails);
    } ;

    let urlMatchesEnvs = function(url, envs) {
      return envs.some(env => {
        if(env.user && env.user.length > 0 && objectHasUrl(url, env.user)){
            return true;
        }
        if(env.admin && env.admin.length > 0 && objectHasUrl(url, env.admin)){
          return true;
        }
        return false;
      });
    };

    /// obj = {url: 'my.url'}
    let objectHasUrl = function(url, obj){
      return obj.some(user => {
        if(user.url && url.startsWith(user.url)) {
            return true;
        }
      });
    };

    let getEnvironmentsPromise= function() {
      return new Promise((resolve, reject) => {
        Background.getEnvironments((envs) => {
          resolve(envs);
        });
      });
    } ;

    Background.getSettings = function(sendResponse) {
        chrome.storage.sync.get({ settings: Coon.Settings }, function (res) {
            var settings = $.extend(settings, Coon.Settings, res.settings);
            sendResponse( settings );
        });
    };

    Background.getEnvironments = function(sendResponse) {
      $.getJSON('defaults/environments.json').then(function(defaultEnvs){
        chrome.storage.sync.get({ environments: defaultEnvs }, function (res) {
          sendResponse(mergeEnvironments(defaultEnvs, res.environments));
        });
      });
    };

    let mergeEnvironments = function(defaultEnvs, userEnvs) {
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
    };

  return Background;

})(Coon.Background || {});
