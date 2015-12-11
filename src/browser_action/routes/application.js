(function(){
  'use strict';
  App.ApplicationRoute = Ember.Route.extend({
    beforeModel : function() {
      this.transitionTo('environments');
    }
  });
})();
