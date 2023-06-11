MyApp.controller('footerController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
      Layout.initFooter(); // init footer
    });
  }]);