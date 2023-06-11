(function () {
  'use strict';
  angular
    .module('MyApp')
    .config(function routerConfig($stateProvider, APP_CONFIG) {


      var a_language = APP_CONFIG.languageConfig.language;

      let res = "faq";
      let state = "admin." + res;
      let ctrl = res + ".Controller";
      let temp = "/app/modules/admin/pages/";

      $stateProvider
        .state(state, {
          abtract: true,
          url: "/" + res,
          template: "<div ui-view></div>",
        })
        .state(state + ".list", {
          url: "/list",
          templateUrl: temp + "list.html",
          controller: ctrl,
          pageTitle: a_language.c_list + " " + a_language[res]
        })
        .state(state + ".create", {
          url: "/create",
          templateUrl: temp + "form.html",
          controller: ctrl,
          pageTitle: a_language.c_create + " " + a_language[res]
        })
        .state(state + ".update", {
          url: "/update/{id}",
          templateUrl: temp + "form.html",
          controller: ctrl,
          pageTitle: a_language.c_update + " " + a_language[res]
        })
        .state(state + ".detail", {
          url: "/detail/{id}",
          templateUrl: temp + "form.html",
          controller: ctrl,
          pageTitle: a_language.c_detail + " " + a_language[res]
        })

    });
})();
