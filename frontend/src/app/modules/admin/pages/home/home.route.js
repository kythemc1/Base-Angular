(function () {
  'use strict';
  angular
    .module('MyApp')
    .config(function routerConfig($stateProvider, APP_CONFIG) {
      var res = "home";
      var state = "admin." + res;
      var ctrl = res + ".Controller";
      var temp = "/app/modules/admin/pages/" + res + "/" + res + ".html";
      var a_language = APP_CONFIG.languageConfig.language;
      
      $stateProvider
        .state(state, {
          url: "/home",
          templateUrl: temp,
          controller: ctrl,
          pageTitle: a_language.c_homeAdmin
        })
    });
})();
