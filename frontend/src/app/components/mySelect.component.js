(function () {
  "use strict";

  angular.module("MyApp").directive('mySelect', function ($compile, ApiService, APP_CONFIG) {

    return {
      restrict: 'A',  //attribute
      scope: {
        ngModel: '=?',
        mOption: '=',
        mKeytoid: '@',
        mKeytotext: '@',
        mClear: '@',
        mSearch: '@',
        mMultiple: '@',
        mRequiredInput: '='
      },
      link: function ($scope, $element, $attrs) {
        var a_language = APP_CONFIG.languageConfig.language;
        var init = function () {
          var unbind;
          var config = {
            minimumResultsForSearch: Infinity, //ẩn tìm kiếm
            placeholder: a_language.c_select,

            language: {
              noResults: function () {
                return a_language.select2_emptyValue;
              },
              searching: function () {
                return a_language.select2_searching;
              },
              inputTooShort: function () {
                return "Nhập vào " + $scope.mRequiredInput + " ký tự để tìm kiếm";
              },
            },           

          };

          //hiện tìm kiếm
          if ($scope.mSearch != undefined) {
            config.minimumResultsForSearch = true;
          }

          //hiện icon xoá
          if ($scope.mClear != undefined) {
            config.allowClear = true;
          }

          //chọn nhiều
          if ($scope.mMultiple != undefined) {
            config.multiple = true;
          }

          if($scope.mRequiredInput != undefined){
            minimumInputLength = $scope.mRequiredInput;
          }

          $scope.$watch('mOption', function (newValue, oldValue) {
            if (newValue != undefined) {
              newValue = newValue.map(function (item) {
                //not allow html
                if (item[$scope.mKeytotext]) {
                  item.text = item[$scope.mKeytotext].replace(/</g, "&lt;");
                }
                else {
                  item.text = item.text.replace(/</g, "&lt;");
                }
                if (item[$scope.mKeytoid]) {
                  item.id = item[$scope.mKeytoid];
                }
                return item;
              });
              config.data = newValue;              

              var select2_init = $element.select2(config);

              if ($element.find('option:first').val() == "? undefined:undefined ?" && !$scope.mMultiple) {
                $element.find('option:first').val("");
                $element.closest(".form-group").find('.select2-selection__clear').remove();                
                $element.closest(".form-group").find('.select2-selection__rendered').prepend(`<span class="select2-selection__placeholder">Chọn</span>`)
              }

              unbind = $scope.$watch('ngModel', function (newVal, oldVal) {
                if (newVal != undefined) {
                  setTimeout(function () {
                    if ($.isArray(newVal)) {
                      unbind();
                      $element.val(newVal).trigger('change');
                    } else {
                      $element.val(newVal + '').trigger('change');
                    }
                  }, 300);
                }
              }, true); //,true dành cho array             

            }
          });
        }

        init();

        $element.on('select2:opening', (event) => {
          //fix bug esc modal
          if ($scope.mSearch && $scope.mSearch != "") {
            $($scope.mSearch).removeAttr("tabindex", "-1");
          }
        });

        $element.on("select2:close", function (event) {
          //fix bug esc modal
          if ($scope.mSearch && $scope.mSearch != "") {
            $($scope.mSearch).attr("tabindex", "-1");
          }
          $(this).focus();
        });

      }
    }
  });
})();

