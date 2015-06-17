(function(){

// Variables
var _navbar, _navbarWrapper, _navbarUserList;
var _isAdmin = false;

chrome.runtime.sendMessage({ action : 'navbar' }, function(response) {
	// ----------------------------------------------------------
	// This part of the script triggers when page is done loading
	// ----------------------------------------------------------
	chrome.storage.sync.get({ navbarEnabled: true }, function (storage) {

		if(storage.navbarEnabled === false) return;

        showTopbar();
	});

});

function showTopbar() {
    var vars = retrieveWindowVariables(["Jpn.Shared.BaseUrl", "Jpn.Admin.Shared.BaseUrl"]);
    var baseUrl = vars ? 
                    vars["Jpn.Shared.BaseUrl"] ? 
                        vars["Jpn.Shared.BaseUrl"] : 
                        vars["Jpn.Admin.Shared.BaseUrl"] ? 
                            vars["Jpn.Admin.Shared.BaseUrl"] : 
                            '/'
                    : '/' ;

    var root = $.get(baseUrl);
        root.then(addTopBarValues);


    chrome.storage.sync.get({skipRadRoomEnabled : false }, function(storage){
        if(storage.skipRadRoomEnabled)
            root.then(function(){
                if(!_isAdmin)
                    initSkipRadRoom();
            });
    });
    
    createNavBar();
}

function initSkipRadRoom(){
    $('a', _navbarUserList).on('click', function(e){
        e.preventDefault();
        var thisLink = $(this).prop('href');
        $.get(thisLink, function(data) {
            var html = $($.parseHTML(data));
            var btnLink = $('#RespiteOffButton', html).prop('href');
            window.location.replace(btnLink);
        });
    });
}

function addTopBarValues(html) {
    var patients = getPatientsFromHtml(html);
    createLinks(patients);
       
}

function getPatientsFromHtml(html){
    var html = $("<div></div>").html(html),
        rows = html.find('tr');

        _isAdmin = html.find('.container>h2').children().length === 0;

    var patients = $.map(rows, function(row){
        var tds = $(row).find('td');
        var link = _isAdmin 
                    ? tds.eq(1).find('a').attr('href') 
                    : tds.eq(0).find('a').attr('href');
        if(tds.length>0){
            return {
                pnr 	: tds.eq(0).text().trim(),
                link	: link,
                name	: tds.eq(1).text().trim(),
                county	: tds.eq(2).text().trim(),
                logins	: parseInt(tds.eq(3).text().trim())
            }
        }
    });
    
    return patients;
}

function hideNavbar() {
    _navbarWrapper.removeClass("active");
}

function createLinks(patients) {
    _navbarUserList = $('<ul id="coon-navbar-patient-list"></ul>').appendTo(_navbar);
    patients = patients.sort(function(a,b) { var a=a.logins, b=b.logins; return a==b?0: a>b ? -1:1; });
    $.each(patients, function(i, patient){
        var li = $('<li>');
        var title = ""+ patient.pnr + "\nLän: " + patient.county + "\nInloggningar: " + patient.logins ;
        var link = $('<a href="' + patient.link + '" style="margin-right:20px" title="' + title + '">' + patient.name + '</a>');
        li.append(link).appendTo(_navbarUserList);
    });


}

function createNavBar() {
    _navbarWrapper = $('<div id="coon-navbar"></div>');
        _navbarWrapper
            .prependTo('body');

    var hoverArea = $('<div id="coon-navbar-hoverarea">').prependTo(_navbarWrapper);
    var hoverAreaTrigger = $('<div id="coon-navbar-hoverarea-trigger">').appendTo(hoverArea);
    
    hoverAreaTrigger.hover(function(){
        _navbarWrapper.addClass('active');
    }, function(){
        setTimeout(function(){
            if(!_navbar.is(':hover'))
                _navbarWrapper.removeClass('active');     
        },100);
    });

    var overlay = $('<div id="coon-navbar-overlay"></div>')
        .prependTo(_navbarWrapper);

    _navbar = $('<div id="coon-navbar-content"></div>')
        .prependTo(_navbarWrapper)
        .mouseleave(function(){
            hideNavbar();
        });



    var coonHeader = $('<div id="coon-navbar-content-header"><div></div></div>').appendTo(_navbar);

}

})();

function retrieveWindowVariables(variables) {
    try {
        var ret = {};

        var scriptContent = "";
        for (var i = 0; i < variables.length; i++) {
            var currVariable = variables[i];
            scriptContent += "try { if (typeof " + currVariable + " !== 'undefined') $('body').attr('tmp_" + currVariable + "', " + currVariable + ");\n} catch(err) { }"
        }

        var script = document.createElement('script');
        script.id = 'tmpScript';
        script.appendChild(document.createTextNode(scriptContent));
        (document.body || document.head || document.documentElement).appendChild(script);

        for (var i = 0; i < variables.length; i++) {
            var currVariable = variables[i];
            ret[currVariable] = $("body").attr("tmp_" + currVariable);
            $("body").removeAttr("tmp_" + currVariable);
        }

        $("#tmpScript").remove();

        return ret;
    }
    catch(err) { 
        return ;
    }
}