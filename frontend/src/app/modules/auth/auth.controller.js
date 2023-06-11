(function () {
  "use strict";
  angular
    .module("MyApp")
    .controller("auth.Controller", function ($rootScope, $scope, $timeout, $q, $state, $stateParams, $compile, AuthService, ApiService, APP_CONFIG) {

      var a_language = APP_CONFIG.languageConfig.language;
      var a_userInfo = APP_CONFIG.userInfo;
      $rootScope.isViewLogin = true;
      $scope.dataForm = {};
      $scope.$on("$viewContentLoaded", function () {});

      $scope.login = function () {
        AuthService.login($scope.dataForm.account, $scope.dataForm.password, $scope.dataForm.remember).then(function (res) {
           window.location.href = window.location.origin+"/admin/home";
        }, function (error) {
          $scope.messageErr = a_language.login_loginFalse;
          $scope.$apply();          
        });
      };

    });
})();
