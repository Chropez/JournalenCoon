var Coon = Coon || {};

Coon.JournalComments = (function(JournalComments, Navbar, Utils){
	var urlPost = Utils.getBaseUrl() + 'Settings/UpdateJournalComments',
		urlForm = Utils.getBaseUrl() + 'Settings/JournalComments'

	JournalComments.init = function(){
		Navbar.afterLogin(function(){
			return enableJournalComment();
		});
	};

	enableJournalComment = function(){
		var promise =  $.Deferred();
		var getForm = $.get(urlForm)
						.then(postForm)
						.then(function(){
							promise.resolve();
						})
						// In case an error occurs
						.fail(function(){
							promise.resolve();
						}) ;

		return promise;
	};

	postForm = function(data){
		var html = $($.parseHTML(data));
		return $.ajax({
			headers: getPostFormHeader(html),
			type: 'POST',
			url: urlPost,
			data: {enableJournalComments: 'true'},	
			dataType: 'json',
			success: function(){
				//console.log('The coon enabled journal comments');
			},
			error: function(){
				//console.log('Error: the coon failed to enable journal coomments');
			}
		});
	};

	getPostFormHeader = function(html){
		var antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();
		return { 
			"__RequestVerificationToken": antiForgeryToken 
		} 
	};

	return JournalComments;
})(Coon.JournalComments || {}, Coon.Navbar, Coon.Utils);