$(function(){
	// Private settings
	var navbarCheckbox = $('#enable-navbar');
	var skipRadRoomCheckbox = $('#enable-skip-radroom');

	initSettings();

	// Litseners
	navbarCheckbox.on('change', onEnableNavbarChange);
	skipRadRoomCheckbox.on('change', onEnableSkipRadRoomChange);

	//Functions
	function initSettings() {
		chrome.storage.sync.get({navbarEnabled: true}, function(storage){
			navbarCheckbox.prop('checked', storage.navbarEnabled);
		});

		chrome.storage.sync.get({skipRadRoomEnabled: false}, function(storage){
			skipRadRoomCheckbox.prop('checked', storage.skipRadRoomEnabled);
		});
	}

	function onEnableNavbarChange(){
		var isChecked = navbarCheckbox.is(':checked');
		chrome.storage.sync.get({settings : })
		chrome.storage.sync.set({navbarEnabled: isChecked}, function(){
			showHtmlMessage('<b>The Coon</b> will make your changes the next time you reload the page!');
		});
	}

	function onEnableSkipRadRoomChange(){
		var isChecked = skipRadRoomCheckbox.is(':checked');
		debugger;
		chrome.storage.sync.set({skipRadRoomEnabled: isChecked}, function(){
			showHtmlMessage('<b>The Coon</b> will make your changes the next time you reload the page!');
		});
	}

	function showHtmlMessage(message) {
		$('#message').html(message).show();
	}

});