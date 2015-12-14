var App = Ember.Application.create({
  rootElement: '#ember-app'
});

(function(){
  'use strict';
  // Router
  App.Router.map(function(){
    this.route('settings');
    this.route('environments');
    this.route('about');
  });

})();
