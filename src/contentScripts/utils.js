var Coon = Coon || {};
Coon.Utils = (function(Navbar){
    'use strict';
    
    return {
        getWindowVariables : function(variables) {
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
    }

})(Coon.Navbar || {}); 