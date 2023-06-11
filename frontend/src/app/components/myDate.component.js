(function () {
  "use strict";

  angular.module("MyApp").directive('myDate', function ($compile, ApiService, APP_CONFIG) {
    return {
      restrict: "E",    //element
      scope: {
        name: "@",
        ngModel: "=",
        ngDisabled: "=?",
        mType: "@",
      },
      template: `<input autocomplete="off" name={{name}} type="text" size="16"  class="form-control date-picker" placeholder="dd/mm/yyyy">
      <span class="input-group-addon">
      <a class="btn default date-set btn-sm" type="button" style="padding: 6px 10px;"><i class="fa fa-calendar"></i></a>
      </span>
      <div class="form-control-focus">
      </div>`,
      link: function ($scope, $element, $attrs) {
        var a_language = APP_CONFIG.languageConfig.language;

        var init = function () {

          var config = {
            format: 'dd/mm/yyyy',
            // rtl: App.isRTL(),
            orientation: "bottom left",
            autoclose: true,
            // pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left"),
            showButtonPanel: true,
            language: a_language.key,
            todayHighlight: true,
            forceParse: false, //tự động sửa lại nếu nhập sai
            clearBtn: true
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

          if (typeof $scope.mType !== typeof undefined && $scope.mType !== false) {
            if ($scope.mType == 'year') {
              config.format = "yyyy";
              config.viewMode = "years";
              config.minViewMode = "years";
              $($element).find('input').attr('placeholder', "yyyy");
            }
            if ($scope.mType == 'month') {
              config.format = "mm/yyyy";
              config.viewMode = "months";
              config.minViewMode = "months";
              $($element).find('input').attr('placeholder', "mm/yyyy");
            }
            if ($scope.mType == 'week') {
              config.calendarWeeks = true;
              config.daysOfWeekDisabled = [0, 2, 3, 4, 5, 6];
              $($element).find('input').attr('placeholder', "dd/mm/yyyy");
            }
          }

          $element.on('keydown', function (e) {
            //nhan enter khi nhập dữ liệu bằng gõ số vào ô input
            if (e.keyCode == 13) {
              if ($(".datepicker-dropdown .datepicker-days td").hasClass("focused")) {
                $(".datepicker-dropdown .datepicker-days td.focused").trigger("click");
              }
              else if ($(".datepicker-dropdown .datepicker-days td").hasClass("active")) {
                $(".datepicker-days td.active").trigger("click");
              }
              else if ($(".datepicker-dropdown .datepicker-months td span").hasClass("focused")) {
                $(".datepicker-dropdown .datepicker-months td span.focused").trigger("click");
              }
              else if ($(".datepicker-dropdown .datepicker-months td span").hasClass("active")) {
                $(".datepicker-dropdown .datepicker-months td span.active").trigger("click");
              }
              else if ($(".datepicker-dropdown .datepicker-years td span").hasClass("focused")) {
                $(".datepicker-dropdown .datepicker-years td span.focused").trigger("click");
              }
              else if ($(".datepicker-dropdown .datepicker-years td span").hasClass("active")) {
                $(".datepicker-dropdown .datepicker-years td span.active").trigger("click");
              }
            }

            /*  17 : trcl,86 : v,67 : c,88 : x */

            if ($.inArray(e.keyCode, [46, 8, 9, 27, 110, 17, 86, 67, 88]) !== -1 ||
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

          var datepicker_init = $element.datepicker(config);

          datepicker_init.on("changeDate", function (e) {
            if (e.date) {
              if (config.format == "yyyy") {
                if (moment($element.find("input").val(), "YYYY", true).isValid()) {
                  $scope.ngModel = moment(e.date).format();
                  _.defer(function () {
                    $scope.$apply();
                  });
                }
              } else if (config.format == "mm/yyyy") {
                if (moment($element.find("input").val(), "MM/YYYY", true).isValid()) {
                  $scope.ngModel = moment(e.date).format();
                  _.defer(function () {
                    $scope.$apply();
                  });
                }
              } else {
                if (moment($element.find("input").val(), "DD/MM/YYYY", true).isValid()) {
                  $scope.ngModel = moment(e.date).format();
                  _.defer(function () {
                    $scope.$apply();
                  });
                }
              }
            }

            setTimeout(() => {
              $element.find('input').focusout();
            }, 100);

          });

          //bắt sự kiện copy paste
          datepicker_init.on("change", function (e) {
            if ($element.find('input').val()) {
              if (config.format == "yyyy") {
                if (moment($element.find("input").val(), "YYYY", true).isValid()) {
                  var val = moment($element.find('input').val(), "YYYY");
                  $scope.ngModel = moment(val).format();
                  _.defer(function () {
                    $scope.$apply();
                  });
                }
              } else if (config.format == "mm/yyyy") {
                if (moment($element.find("input").val(), "MM/YYYY", true).isValid()) {
                  var val = moment($element.find('input').val(), "MM/YYYY");
                  $scope.ngModel = moment(val).format();
                  _.defer(function () {
                    $scope.$apply();
                  });
                }
              } else {
                if (moment($element.find("input").val(), "DD/MM/YYYY", true).isValid()) {
                  var val = moment($element.find('input').val(), "DD/MM/YYYY");
                  $scope.ngModel = moment(val).format();
                  _.defer(function () {
                    $scope.$apply();
                  });
                }
              }

            }
            else {
              $scope.ngModel = null;
              _.defer(function () {
                $scope.$apply();
              });
            }
          });

          datepicker_init.on("clearDate", function (e) {
            $scope.ngModel = null;
            _.defer(function () {
              $scope.$apply();
            });
          });


          $scope.$watch('ngModel', function (newValue, oldValue) {
            if (newValue != undefined && oldValue == undefined) {
              datepicker_init.datepicker('setDate', new Date(newValue));
            }
            else if (newValue == undefined && oldValue != undefined) {
              datepicker_init.datepicker('setDate', "");
            }
          });

        }
        init();
      }
    };
  });
})();
