(function () {
  'use strict';
  angular
    .module('MyApp')
    .config(function routerConfig($stateProvider, APP_CONFIG) {
      var res = "auth";
      var ctrl = res + ".Controller";
      var temp = "/app/modules/" + res;
      var a_language = APP_CONFIG.languageConfig.language;

      $stateProvider
        .state(res, {
          url: "/auth",
          abtract: true,
          templateUrl: temp + "/auth.html",
          controller: ctrl
        })
        .state(res + ".login", {
          url: "/login",
          templateUrl: temp + "/login.html",
          controller: ctrl,
          pageTitle: a_language.login
        })
    });
})();
