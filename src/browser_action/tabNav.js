var Coon = Coon || {};

Coon.TabNav = (function(TabNav){
	'use strict';
	var _defaultSettings = {
		navbar : $('#tab-nav'), // must be jquery element
		target : $('#tab-nav-content') // must be jquery element
	};

	var _settings = _defaultSettings;

	TabNav.init = function(settings) {
		settings = settings || {};
		_settings = $.extend(_defaultSettings, settings);

		_settings.navbar.find('a').on('click', function(e){
			e.preventDefault();

		});
	};
	return TabNav;
})(Coon.TabNav || {});
