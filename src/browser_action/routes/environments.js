(function(){
  'use strict';
  App.EnvironmentsRoute = Ember.Route.extend({
    model : function() {
      return $.getJSON('../fixtures/environments.json');
    }
  });
})();
