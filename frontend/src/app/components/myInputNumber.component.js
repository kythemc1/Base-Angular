(function () {
  "use strict";

  angular.module("MyApp").directive('myNumberInteger', function () {
    return {
      restrict: 'C',  //class
      link: function ($scope, $element, $attrs) {
        var init = function () {
          $element.on('keydown', function (e) {
            //key 190 is "."
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
              // Allow: Ctrl+A, Command+A
              (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
              // Allow: home, end, left, right, down, up
              (e.keyCode >= 35 && e.keyCode <= 40)) {
              // let it happen, don't do anything
              return true;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      
              return false;
            }
          });
        }
        init();
      }
    }
  });

})();

(function () {
  "use strict";

  angular.module("MyApp").directive('myNumberFloat', function () {
    return {
      restrict: 'C',
      link: function ($scope, $element, $attrs) {
        var init = function () {
          $element.on('keydown', function (e) {
            
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
              // Allow: Ctrl+A, Command+A
              (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
              // Allow: home, end, left, right, down, up
              (e.keyCode >= 35 && e.keyCode <= 40)) {
              // let it happen, don't do anything
              return true;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      
              return false;
            }
          });
        }
        init();
      }
    }
  });

})();
