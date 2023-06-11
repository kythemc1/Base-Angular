(function () {
  "use strict";

  angular.module("MyApp").directive('mySummernote', function ($compile, ApiService, APP_CONFIG) {
    return {
      restrict: 'A',    //attribute
      scope: {
        ngModel: '=',
        disabled: '@',
        ngDisabled: '=?',
      },
      link: function ($scope, $element, $attrs) {
        var init = function () {

          _.defer(function () {
            $element.summernote({
              placeholder: 'Nhập nội dung',
              minHeight: 200,
              maxHeight: 500,
              focus: false,
              dialogsFade: false,
              dialogsInBody: false,
              appendToBody: false,
              toolbar: [
                //['head', ['style']],
                ['fontsize', ['fontsize', 'color', 'fontname']],
                ['style', ['bold', 'italic', 'underline']],
                //['font', ['strikethrough', 'superscript', 'subscript']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                //['insert', ['picture', 'link', 'video', 'hr']],
                ['mics', ['fullscreen', 'codeview']]
              ],
              callbacks: {
                onBlur: onBlur,
                onChange: function (value) {
                  setTimeout(() => {
                    $($element).valid();
                  }, 300);
                }
              },
            });

            if ($scope.disabled) {
              $element.summernote('disable');
            }
            $scope.$watch('ngDisabled', function (newValue) {
              if (newValue != undefined && newValue) {
                $element.summernote('disable');
              } else {
                $element.summernote('enable');
              }
            });

            function onBlur(e) {
              var value = $element.summernote('code');

              // thẻ list
              if (value == "<ol><li><br></li></ol>") {
                value = "<ol><li></li></ol>"
              }
              //cắt kí tự cách và enter
              while (value.startsWith('<p><br></p>')) {
                value = value.replace('<p><br></p>', '')
              }
              while (value.startsWith('<div><br></div>')) {
                value = value.replace('<div><br></div>', '')
              }
              while (value.endsWith('<p><br></p>')) {
                value = value.replace(new RegExp('<p><br></p>$'), '')
              }
              while (value.endsWith('&nbsp;</p>')) {
                value = value.replace(new RegExp('&nbsp;</p>$'), '</p>')
              }
              while (value.endsWith('&nbsp; </p>')) {
                value = value.replace(new RegExp('&nbsp; </p>$'), '</p>')
              }
              while (value.startsWith('&nbsp;')) {
                value = value.replace('&nbsp;', '')
              }
              while (value.startsWith(' &nbsp;')) {
                value = value.replace(' &nbsp;', '')
              }
              //lúc xóa
              if (value == "<p></p>" || value == "&nbsp;" || value == " &nbsp;") {
                value = "";
              }
              $scope.ngModel = value;
              $scope.$apply();
            };
            $scope.$watch('ngModel', function (newVal, oldValue) {
              if (newVal != undefined) {
                $element.summernote('code', newVal);
              }
            });
          });

        };
        init();
      }
    }
  });

})();
