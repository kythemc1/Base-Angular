(function () {
  'use strict';
  angular
    .module('MyApp')
    .config(function routerConfig($stateProvider, APP_CONFIG) {
      var res = "client";
      var ctrl = res + ".Controller";
      var temp = "/app/modules/" + res;
      var a_language = APP_CONFIG.languageConfig.language;

      $stateProvider
        .state(res, {
          url: "/client",
          templateUrl: temp + "/client.html",
          controller: ctrl,
          pageTitle: a_language.c_home
        })
    });
})();
