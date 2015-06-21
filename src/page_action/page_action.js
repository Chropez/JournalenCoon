var Coon = Coon || {};

var getSettings = chrome.extension.getBackgroundPage().Coon.Background.getSettings;

Coon.PageAction = (function(PageAction){
	'use strict';
	// Private settings
	var navbarCheckbox = $('#enable-navbar'),
	skipRadRoomCheckbox = $('#enable-skip-radroom'),
	rememberLastPage = $('#remember-last-page');

	initSettings();

	// Litseners
	navbarCheckbox.on('change', onEnableNavbarChange);
	skipRadRoomCheckbox.on('change', onEnableSkipRadRoomChange);
	rememberLastPage.on('change', onEnableRememberLastPage);

	//Functions
	function initSettings() {
		getSettings(function(settings) {
			navbarCheckbox.prop('checked', settings.navbarEnabled);
			skipRadRoomCheckbox.prop('checked', settings.skipRadRoomEnabled);
			rememberLastPage.prop('checked', settings.rememberLastPage);

			toggleDisabledSubMenus(!settings.navbarEnabled);
		});
	}

	function onEnableNavbarChange(){
		var isChecked = navbarCheckbox.is(':checked');

		getSettings(function(settings){
			settings.navbarEnabled = isChecked;
			chrome.storage.sync.set({settings : settings}, function(){
				showHtmlMessage('<b>The Coon</b> will make your changes the next time you reload the page!');
			});
		});

		toggleDisabledSubMenus(!isChecked);
	}

	function onEnableSkipRadRoomChange(){
		var isChecked = skipRadRoomCheckbox.is(':checked');
		getSettings(function(settings){
			settings.skipRadRoomEnabled = isChecked;
			chrome.storage.sync.set({settings : settings}, function(a){
				showHtmlMessage('<b>The Coon</b> will make your changes the next time you reload the page!');
			});
		});
	}

	function onEnableRememberLastPage(){
		var isChecked = rememberLastPage.is(':checked');
			getSettings(function(settings){
				settings.rememberLastPage = isChecked;
				chrome.storage.sync.set({settings : settings}, function(){
					showHtmlMessage('<b>The Coon</b> will make your changes the next time you reload the page!');
			});
		});	
	}

	function toggleDisabledSubMenus(showAsdisabled){
		$.each([skipRadRoomCheckbox, rememberLastPage], function(i, checkbox){
			checkbox.prop('disabled', showAsdisabled);
		});
	}

	function showHtmlMessage(message) {
		$('#message').html(message).show();
	}

	return PageAction;

})(Coon.PageAction || {});
