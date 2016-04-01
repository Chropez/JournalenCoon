var Coon = Coon || {};

(function(Navbar, Utils) {
	'use strict';

	class JournalComments {
		constructor() {
			this.urlPost = Utils.getBaseUrl() + 'Settings/UpdateJournalComments';
			this.urlForm = Utils.getBaseUrl() + 'Settings/JournalComments';
		}

		init() {
			Navbar.afterLogin(() => {
				return this.enableJournalComment();
			});
		}

		enableJournalComment() {
				const promise =  $.Deferred();
				const _this = this;
				$.get(this.urlForm)
					.then((data) => {
						_this.postForm(data);
					})
					.then(() => {
						promise.resolve();
					})
					// In case an error occurs
					.fail(() => {
						promise.resolve();
					}) ;

				return promise;
		}


		postForm(data) {
			var html = $($.parseHTML(data));
			return $.ajax({
				headers: this.getPostFormHeader(html),
				type: 'POST',
				url: this.urlPost,
				data: {enableJournalComments: 'true'},
				dataType: 'json',
				success: function(){
					console.log('The coon enabled journal comments');
				},
				error: function(){
					console.log('Error: the coon failed to enable journal coomments');
				}
			});
		}

		getPostFormHeader (/* html */){
			var antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();
			return {
				"__RequestVerificationToken": antiForgeryToken
			};
		}
	}

	Coon.JournalComments = new JournalComments();
})(Coon.Navbar, Coon.Utils);
