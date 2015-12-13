(function(){
  'use strict';
  App.SettingsController = Ember.Controller.extend({
    showErrorMessage: false,
    reloadMessageChangedCount : 0, // queues messages so they dont get disabled.
    showReloadPageMessage: function() {
      this.set('showErrorMessage', true);
      this.incrementProperty('reloadMessageChangedCount');

      // Show message for only 5 seconds
      Ember.run.later(() => {
        const reloadMessageChangedCount = this.get('reloadMessageChangedCount');
        if(reloadMessageChangedCount===1) {
          this.set('showErrorMessage', false);
        }
        this.decrementProperty('reloadMessageChangedCount');
      }, 5000);
    },
    actions : {
      saveSettings: function(){
        let settings = this.get('model')
          .getProperties('navbarEnabled',
                         'rememberLastPageEnabled',
                         'keepMeLoggedInEnabled',
                         'journalCommentAutoEnabled');

 				chrome.storage.sync.set({settings : settings}, () => {
   					this.showReloadPageMessage();
   			});
      }
    }
  });
})();
