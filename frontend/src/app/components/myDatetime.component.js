
(function () {
  "use strict";

  angular.module("MyApp").directive('myDatetime', function ($compile, ApiService, APP_CONFIG) {
    return {
      restrict: 'E',  //element
      scope: {
        name: "@",
        ngModel: "=",
        ngDisabled: "=?",
      },
      template: `<input autocomplete="off" name={{name}} type="text" size="16"  class="form-control date-picker" placeholder="dd/mm/yyyy hh:mm">
      <span class="input-group-addon">
      <a class="btn default date-set btn-sm" type="button" style="padding: 6px 10px;"><i class="fa fa-calendar"></i></a>
      </span>
      <div class="form-control-focus">
      </div>`,
      link: function ($scope, $element, $attrs) {
        var a_language = APP_CONFIG.languageConfig.language;

        var init = function () {
          var config = {
            format: 'dd/mm/yyyy hh:ii',
            rtl: App.isRTL(),
            orientation: "bottom left",
            pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left"),
            autoclose: true,
            language: a_language.key,
            todayHighlight: true,
            // forceParse: false,
            clearBtn: true,
            // startDate: "2000-01-01",
            // endDate: "2300-01-01"
          };

          $($element).addClass("input-group date bs-datetime");

          var attr = $($element).attr('disabled');

          if (typeof attr !== typeof undefined && attr !== false) {
            $($element).css('cursor', 'not-allowed');
            $($element).find('input').attr('disabled', true);
            $($element).find('input').css('cursor', 'not-allowed');
            $($element).find('span button').attr('disabled', true);
            $($element).find('span button').css('cursor', 'not-allowed');
            $($element).find('span').css('pointer-events', 'none');
          }

          $scope.$watch('ngDisabled', function (newValue) {
            if (newValue != undefined && newValue) {
              $($element).css('cursor', 'not-allowed');
              $($element).find('input').attr('disabled', true);
              $($element).find('input').css('cursor', 'not-allowed');
              $($element).find('span button').attr('disabled', true);
              $($element).find('span button').css('cursor', 'not-allowed');
              $($element).find('span').css('pointer-events', 'none');
            } else {
              $($element).css('cursor', '');
              $($element).find('input').attr('disabled', false);
              $($element).find('input').css('cursor', '');
              $($element).find('span button').attr('disabled', false);
              $($element).find('span button').css('cursor', 'pointer');
              $($element).find('span').css('pointer-events', 'auto');
            }
          });

          $element.on('keydown', function (e) {
            if (e.keyCode == 13) {
              if ($(".datetimepicker.dropdown-menu .datetimepicker-minutes td span").hasClass("active")) {
                $(".datetimepicker.dropdown-menu .datetimepicker-minutes td span.active").trigger("click");
              }
            }

            /*  17 : trcl,86 : v,67 : c,88 : x */
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 32, 110, 186, 17, 86, 67, 88]) !== -1 ||
              // Allow: Ctrl+A, Command+A
              (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
              // Allow: home, end, left, right, down, up
              (e.keyCode >= 35 && e.keyCode <= 40) ||

              // Allow: -
              // e.keyCode == 109 || e.keyCode == 189) {
              //   // let it happen, don't do anything
              //   return true;
              // }
              e.keyCode == 111 || e.keyCode == 191) {
              // let it happen, don't do anything
              return true;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
              return false;
            }
          });

          var datetimepicker_init = $element.datetimepicker(config);

          //bắt sự kiện chọn
          datetimepicker_init.on("changeDate", function (e) {
            if (e.date) {
              if (moment($element.find("input").val(), "DD/MM/YYYY HH:mm", true).isValid()) {
                $scope.ngModel = moment(e.date).format();
                _.defer(function () {
                  $scope.$apply();
                });
              }
            }
            setTimeout(() => {
              $element.find('input').focusout();
            }, 100);

          });

          //bắt sự kiện copy paste
          datetimepicker_init.on("change", function (e) {
            if ($element.find('input').val()) {
              var val = moment($element.find('input').val(), "DD/MM/YYYY HH:mm");
              $scope.ngModel = moment(val).format();
              _.defer(function () {
                $scope.$apply();
              });
            }
            else {
              $scope.ngModel = null;
              _.defer(function () {
                $scope.$apply();
              });
            }
          });

          $scope.$watch('ngModel', function (newValue, oldValue) {
            if (newValue != undefined && oldValue == undefined) {
              datetimepicker_init.datetimepicker('setDate', new Date(newValue));
            }
            else if (newValue == undefined && oldValue != undefined) {
              datetimepicker_init.datetimepicker('setDate', new Date(""));
            }
          });

        }
        init();
      }
    }
  });
})();