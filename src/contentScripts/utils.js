var Coon = Coon || {};
Coon.Utils = (function(Utils, Navbar){
    'use strict';

    var _baseUrl = undefined;

    var init = function(){
        calculateBaseUrl();
    }


    Utils.getWindowVariables = function(variables) {
        try {
            var ret = {}, currVariable, i ;

            var scriptContent = "";
            for (i = 0; i < variables.length; i++) {
                currVariable = variables[i];
                scriptContent += "try { if (typeof " + currVariable + " !== 'undefined') $('body').attr('tmp_" + currVariable + "', " + currVariable + ");\n} catch(err) { }";
            }

            var script = document.createElement('script');
            script.id = 'tmpScript';
            script.appendChild(document.createTextNode(scriptContent));
            (document.body || document.head || document.documentElement).appendChild(script);

            for (i = 0; i < variables.length; i++) {
                currVariable = variables[i];
                ret[currVariable] = $("body").attr("tmp_" + currVariable);
                $("body").removeAttr("tmp_" + currVariable);
            }

            $("#tmpScript").remove();

            return ret;
        }
        catch(err) { 
            return ;
        }
    };

    /// Gets the baseUrl from Journalen using their existing js-variable
    /// If the returnDetails param is passed then an object will be returned
    Utils.getBaseUrl = function(returnDetails) {
        if(!returnDetails) {
            return _baseUrl.baseUrl || _baseUrl.defaultBaseUrl;
        } else {
            return _baseUrl;
        }       
    };

    var calculateBaseUrl = function(){
        var defaultBaseUrl = location.protocol + "//" + location.host;
        var vars =  Utils.getWindowVariables(["Jpn.Shared.BaseUrl", "Jpn.Admin.Shared.BaseUrl"]);
        var baseUrl =  vars ? 
                    vars["Jpn.Shared.BaseUrl"] ? 
                        vars["Jpn.Shared.BaseUrl"] : 
                        vars["Jpn.Admin.Shared.BaseUrl"] ? 
                            vars["Jpn.Admin.Shared.BaseUrl"] : 
                            undefined
                    : undefined ;


        _baseUrl = {};
        _baseUrl.defaultBaseUrl = defaultBaseUrl ;
        _baseUrl.baseUrl = baseUrl || defaultBaseUrl ;
        _baseUrl.url = baseUrl ? defaultBaseUrl + baseUrl : defaultBaseUrl; //fullUrl
        _baseUrl.isFromJournalen = (baseUrl !== undefined) || false;

        if(vars && _baseUrl.isFromJournalen) {
            _baseUrl.isAdmin = (vars["Jpn.Admin.Shared.BaseUrl"] !== undefined) || false;
        }

    };

    init();

    return Utils;

})(Coon.Utils || {}, Coon.Navbar); 