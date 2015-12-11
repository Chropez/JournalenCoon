(function(){
  'use strict';
  App.SettingsController = Ember.Controller.extend({
    settingsUpdated: Ember.observer(
      'model.navbarEnabled',
      'model.rememberLastPageEnabled',
      'model.keepMeLoggedInEnabled',
      'model.journalCommentAutoEnabled', function() {
        Ember.run.once(this, function(){
          var plainObj = this.get('model');
          debugger;
        });
      })
  });
})();
