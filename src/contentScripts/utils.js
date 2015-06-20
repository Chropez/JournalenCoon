var Coon = Coon || {};
Coon.Utils = (function(Utils, Navbar){
    'use strict';

    Utils.getWindowVariables = function(variables) {
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
    };

    /// Gets the baseUrl from Journalen using their existing js-variable
    /// If the returnDetails param is passed then an object will be returned
    Utils.getBaseUrl = function(returnDetails) {
        var defaultBaseUrl = location.protocol + "//" + location.host;
        var vars =  Utils.getWindowVariables(["Jpn.Shared.BaseUrl", "Jpn.Admin.Shared.BaseUrl"]);
        var baseUrl =  vars ? 
                    vars["Jpn.Shared.BaseUrl"] ? 
                        vars["Jpn.Shared.BaseUrl"] : 
                        vars["Jpn.Admin.Shared.BaseUrl"] ? 
                            vars["Jpn.Admin.Shared.BaseUrl"] : 
                            undefined
                    : undefined ;

        if(!returnDetails)
            return baseUrl || defaultBaseUrl;

        var returnObj = {};

        returnObj.baseUrl = baseUrl || defaultBaseUrl;
        returnObj.url = baseUrl ? defaultBaseUrl + baseUrl : defaultBaseUrl; //fullUrl
        returnObj.isFromJournalen = (baseUrl !== undefined) || false;

        if(vars && returnObj.isFromJournalen)
            returnObj.isAdmin = (vars["Jpn.Admin.Shared.BaseUrl"] !== undefined) || false;

        return returnObj
    };

    return Utils;

})(Coon.Utils || {}, Coon.Navbar); 