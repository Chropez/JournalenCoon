(function(){
  'use strict';
  App.EnvironmentsRoute = Ember.Route.extend({
    model : function() {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        chrome.runtime.getBackgroundPage(function(bgPage){
        	bgPage.Coon.Background.getEnvironments(function(envs){
            resolve(envs);
          });
        });
      });
    }
  });
})();
