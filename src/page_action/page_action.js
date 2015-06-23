var Coon = Coon || {};

Coon.PageAction = (function(PageAction){
	'use strict';
	// Private settings
	var _getSettings = undefined;

	var navbarCheckbox = $('#enable-navbar'),
	skipRadRoomCheckbox = $('#enable-skip-radroom'),
	rememberLastPageCheckbox = $('#enable-remember-last-page'),
	keepMeLoggedInCheckbox = $('#enable-keep-me-logged-in');


	// Litseners
	navbarCheckbox.on('change', onEnableNavbarChange);
	skipRadRoomCheckbox.on('change', onEnableSkipRadRoomChange);
	rememberLastPageCheckbox.on('change', onEnableRememberLastPageChange);
	keepMeLoggedInCheckbox.on('change', onEnableKeepMeLoggedInChange);

	//Functions
	PageAction.init = function(getSettings) {
		_getSettings = getSettings;

		_getSettings(function(settings) {
			navbarCheckbox.prop('checked', settings.navbarEnabled);
			skipRadRoomCheckbox.prop('checked', settings.skipRadRoomEnabled);
			rememberLastPageCheckbox.prop('checked', settings.rememberLastPageEnabled);
			keepMeLoggedInCheckbox.prop('checked', settings.keepMeLoggedInEnabled);

			toggleDisabledSubMenus(!settings.navbarEnabled);
		});
	}

	function onEnableNavbarChange(){
		var isChecked = navbarCheckbox.is(':checked');

		_getSettings(function(settings){
			settings.navbarEnabled = isChecked;
			chrome.storage.sync.set({settings : settings}, function(){
				showHtmlMessage('<b>The Coon</b> will make your changes the next time you reload the page!');
			});
		});

		toggleDisabledSubMenus(!isChecked);
	}

	function onEnableSkipRadRoomChange(){
		var isChecked = skipRadRoomCheckbox.is(':checked');
		_getSettings(function(settings){
			settings.skipRadRoomEnabled = isChecked;
			chrome.storage.sync.set({settings : settings}, function(a){
				showHtmlMessage('<b>The Coon</b> will make your changes the next time you reload the page!');
			});
		});
	}

	function onEnableRememberLastPageChange(){
		var isChecked = rememberLastPageCheckbox.is(':checked');
			_getSettings(function(settings){
				settings.rememberLastPageEnabled = isChecked;
				chrome.storage.sync.set({settings : settings}, function(){
					showHtmlMessage('<b>The Coon</b> will make your changes the next time you reload the page!');
			});
		});	
	}

	function onEnableKeepMeLoggedInChange(){
		var isChecked = keepMeLoggedInCheckbox.is(':checked');
			_getSettings(function(settings){
				settings.keepMeLoggedInEnabled = isChecked;
				chrome.storage.sync.set({settings : settings}, function(){
					showHtmlMessage('<b>The Coon</b> will make your changes the next time you reload the page!');
			});
		});	
	}

	function toggleDisabledSubMenus(showAsdisabled){
		$.each([skipRadRoomCheckbox, rememberLastPageCheckbox], function(i, checkbox){
			checkbox.prop('disabled', showAsdisabled);
		});
	}

	function showHtmlMessage(message) {
		$('#message').html(message).show();
	}

	return PageAction;

})(Coon.PageAction || {});

chrome.runtime.getBackgroundPage(function(bgPage){
	Coon.PageAction.init(bgPage.Coon.Background.getSettings);
});
