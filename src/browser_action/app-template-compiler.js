(function(){
  'use strict';
  var templates = [
    'application',
    'settings',
    'environments',
    'about'
  ];

  function compileTemplates() {
    templates.forEach(function(name){
      var templateName = `templates/${name}.hbs`;

      $.get(templateName).then((data) => {
        Ember.TEMPLATES[name] = Ember.Handlebars.compile(data) ;
      });
    });
  }

  compileTemplates();

})();
