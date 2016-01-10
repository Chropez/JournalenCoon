var Coon = Coon || {};

(function(Utils){
	'use strict';

	Coon.KeepMeLoggedOn = class KeepMeLoggedOn {

		constructor(baseUrl, pollInterval) {
			// Init  variables
			this._pollInterval = pollInterval || 15 * 60 * 1000; // 15 minutes
			this._baseUrl = baseUrl || Utils.getBaseUrl(true);
			this._pollUrl = {
				user  : this._baseUrl.url + 'Dashboard/Index',
				admin : this._baseUrl.url + 'Dashboard/Index'
			};

			this.init();
		}

		init() {
			if(!this._baseUrl.isFromJournalen) { return ; } //Do nothing, the user might not be logged in
			if(this._baseUrl.isAdmin) {
				this.startPolling(this._pollUrl.admin);
				return;
			}

			this.startPolling(this._pollUrl.user);
		}

		startPolling(url){
			setInterval(function(){
				$.get(url);
			}, this._pollInterval);
		}
	};
})(Coon.Utils);
