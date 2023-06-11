(function () {
  "use strict";

  angular.module("MyApp").directive('tooltipster', function () {
    return {
      restrict: 'C',  //class
      scope: {
        title: '@'
      },
      link: function ($scope, $element, $attrs) {
        var init = function () {
          if ($element.find('.tooltip_content').length !== 0) {
            $element.tooltipster({
              theme: 'tooltipster-light',
              maxWidth: "500",
              //   contentAsHTML: true,
              functionInit: function (instance, helper) {
                var content = $(helper.origin).find('.tooltip_content').detach();
                instance.content(content);
              }
            });
          } else {
            $element.tooltipster({
              theme: 'tooltipster-light',
              maxWidth: "200"
            });
          }
        }
        init();
      }
    }
  });

})();
