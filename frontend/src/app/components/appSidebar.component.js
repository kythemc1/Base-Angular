(function () {
  "use strict";

  angular.module("MyApp").directive('appSidebar', function ($compile, ApiService, APP_CONFIG) {
    return {
      restrict: 'AE',
      scope: {},
      link: function ($scope, $element, $attrs) {

        let setActive = function (activeItem) {
          $element.find("li.nav-item.active").removeClass("active").removeClass("open");
          $element.find("li.nav-item .nav-link .arrow").removeClass("open");
          $element.find("ul").css("display", "none");

          $(activeItem).addClass("active open");
          while (activeItem) {
            //ul cha gần nhất
            $(activeItem.closest("ul")).css("display", "block");
            //li cha của ul
            var parent = $($(activeItem).parent().closest("li.nav-item")[0]);
            parent.addClass("open active");
            //lên tiếp cha 
            activeItem = $(activeItem).parent().closest("li.nav-item")[0];
          }
        }

        let clickHandle = function (e) {
          var item = e.target.closest("li");
          if (!$(item).hasClass("active")) {
            setActive(item);
          }
        };

        setTimeout(() => {
          var activeItem = $element.find("li.nav-item.active")[0];
          setActive(activeItem);
          $element.find("a.nav-link").click(clickHandle);

        }, 500);


        $scope.$on('$destroy', function () {
          $($element.find("a.nav-link")).off("click", clickHandle)
        });
      }
    }
  });

})();
