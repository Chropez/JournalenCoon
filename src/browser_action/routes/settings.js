(function(){
  'use strict';
  App.SettingsRoute = Ember.Route.extend({
    model: function() {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        chrome.runtime.getBackgroundPage(function(bgPage){
        	bgPage.Coon.Background.getSettings(function(settings){
            resolve(Ember.Object.create(settings));
          });
        });
      });
    }
  });
})();
