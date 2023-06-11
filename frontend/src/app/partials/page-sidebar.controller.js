MyApp.controller('pageSidebarController', ['$state', '$scope', function ($state, $scope) {
  $scope.$on('$includeContentLoaded', function () {
    Layout.initSidebar($state); // init sidebar
  });
}]);
