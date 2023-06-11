(function () {
  "use strict";

  angular.module("MyApp").directive('myCkeditor', function ($compile, ApiService, APP_CONFIG) {
    return {
      restrict: 'A',    //attribute
      scope: {
        ngModel: '=',
        ngDisabled: '='
      },
      link: function ($scope, $element, $attrs) {
        var a_language = APP_CONFIG.languageConfig.language;
        var init = function () {
          var ckeditor_init;

          _.defer(function () {
            ckeditor_init = CKEDITOR.replace($element.attr("id"), {
              language: a_language.key,
              width: '100%',
              height: '300px',
              toolbarCanCollapse: true, //thu nhỏ thanh công cụ            
              autoGrow_minHeight: 300, //k scroll,
              removePlugins: 'resize', //xóa resize
              allowedContent: true, //hiện content gốc
              tabSpaces: 4, //enable tab
              enterMode: CKEDITOR.ENTER_BR, //ENTER_DIV,ENTER_BR,ENTER_P
              toolbarGroups: [
                // {
                //   name: 'document',
                //   groups: ['mode', 'document', 'doctools']
                // },
                {
                  name: 'basicstyles',
                  groups: ['basicstyles']
                },
                {
                  name: 'paragraph',
                  groups: ['list', 'align']
                },
                {
                  name: 'insert'
                },
                {
                  name: 'styles'
                },
                {
                  name: 'tools'
                },
              ],
              extraPlugins: 'autogrow',

            });

            ckeditor_init.on('instanceReady', function (ev) {
              // Ends self closing tags the HTML4 way, like <br>.
              ev.editor.dataProcessor.writer.lineBreakChars = '';
            });

            ckeditor_init.on('blur', function (evt) {
              let value = ckeditor_init.getData();
              $scope.ngModel = value;
              $scope.$apply();
            })

            ckeditor_init.on('change', function (evt) {
              ckeditor_init.updateElement();
              setTimeout(() => {
                $($element).valid();
              }, 300);
            })

            $scope.$watch('ngModel', function (newVal, oldVal) {
              if (newVal != undefined) {
                setTimeout(function () {
                  ckeditor_init.setData(newVal);
                  $scope.$apply();
                }, 300);
              }
            });

            $scope.$watch('ngDisabled', function (newVal, oldVal) {
              if (newVal && newVal != oldVal) {
                ckeditor_init.setReadOnly(true);
              }
            });

          });
        }

        init();
      }
    }
  });
})();
