var Coon = Coon || {};

Coon.BrowserAction = (function(BrowserAction, Settings, TabNav){
	'use strict';
	BrowserAction.init = function(getSettings) {
		// Inits tabs
		TabNav.init({
			navbar : $('#sidebar'),
			target : $('#main-content')
		});

		Settings.init(getSettings);
	};
	return BrowserAction;
})(Coon.BrowserAction || {}, Coon.Settings, Coon.TabNav);

chrome.runtime.getBackgroundPage(function(bgPage){
	Coon.BrowserAction.init(bgPage.Coon.Background.getSettings);
});
