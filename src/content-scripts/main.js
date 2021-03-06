var Coon = Coon || {};

(function() {
  'use strict';

  // Don't activate the Coon if it's already active
  if (Coon.IsActive) {
    return;
  }

  chrome.runtime.sendMessage({
    action: 'settings'
  }, (settings) => {

    if (settings.navbarEnabled) {
      Coon.Navbar.init();

      if (settings.rememberLastPageEnabled) {
        Coon.RememberLastPage.init();
      }
    }

    if (settings.keepMeLoggedInEnabled) {
      Coon.KeepMeLoggedOn.init();
    }

    if (settings.journalCommentAutoEnabled) {
      Coon.JournalComments.init();
    }

    Coon.IsActive = true; // Sets flag that the Coon is Active
  });

})();
