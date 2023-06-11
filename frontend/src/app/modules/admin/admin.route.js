(function () {
  'use strict';
  angular
    .module('MyApp')
    .config(function routerConfig($stateProvider, APP_CONFIG) {
      var res = "admin";
      var ctrl = res + ".Controller";
      var temp = "/app/modules/" + res;
      var a_language = APP_CONFIG.languageConfig.language;

      $stateProvider
        .state(res, {
          url: "/admin",
          templateUrl: temp + "/admin.html",
          abtract: true,
          controller: ctrl,
          pageTitle: a_language.c_homeAdmin,
          // onEnter: function(){
          //   console.log("Đang truy cập vào admin");
          // },
          // onExit: function(){
          //   console.log("Đã thoát truy cập vào admin");
          // }
        })
    });
})();
