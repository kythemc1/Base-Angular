MyApp.controller('headerController', function ($state, $scope, Restangular, $rootScope, AuthService, APP_CONFIG, $http, $location) {

  var a_language = APP_CONFIG.languageConfig.language;
  var a_userInfo = APP_CONFIG.userInfo;

  $scope.$on('$includeContentLoaded', function () {
    Layout.initSidebar($state); // init sidebar
    $("#shortcut-icon").prop("href", $("#shortcut-icon").data("href"));
  });

  $scope.logout = function () {
    swal.show('confirm', a_language.logout, a_language.logout_all, function (confirm) {
      var logoutAll = false;
      if (confirm) {
        logoutAll = true;
      }
      AuthService.logout(logoutAll).then(function (res) {
        $state.go("auth.login");
      }, function (error) {
        toastr.error(a_language.logoutFalse);
      })
    });
  };

  $scope.gotoHome = function () {
    $state.go("admin.home");
  };

  $scope.toggleSidebar = function () {
    if ($('body').hasClass("page-sidebar-closed")) {
      $('body').removeClass("page-sidebar-closed");
    } else {
      $('body').addClass("page-sidebar-closed");
    }
  };

});
