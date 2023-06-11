(function () {
  "use strict";
  angular
    .module("MyApp")
    .controller("admin.Controller", function ($rootScope, $scope, $timeout, $q, $state, $stateParams, $compile, AuthService, ApiService, APP_CONFIG) {
      var a_language = APP_CONFIG.languageConfig.language;
      var a_userInfo = APP_CONFIG.userInfo;
      $rootScope.isViewLogin = false;
      $scope.$on("$viewContentLoaded", function () {

      });
    });
})();
