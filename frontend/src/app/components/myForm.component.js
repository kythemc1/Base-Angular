(function () {
  "use strict";

  angular.module("MyApp").directive('myForm', function ($compile, ApiService, APP_CONFIG) {
    return {
      restrict: 'A',  //attribute
      scope: {
        createFunction: "&",
        updateFunction: "&",
        cancelFunction: "&",
        resetFunction: "&",
        allowSubmitEnter: "@",
      },
      link: function ($scope, $element, $attrs) {
        var a_language = APP_CONFIG.languageConfig.language;
        var countInput = 0;

        var validation = {
          rules: {},
          messages: {}
        }

        //Cấu hình validation cho form dựa vào attributes của các input, select, textarea
        setTimeout(function () {

          $element.attr('novalidate', ' ');
          $element.find(".form-group").find("input, select, textarea, my-date, my-datetime").each(function (i, e) {
            if ($(e).attr("type") == "text") {
              $(e).val().trim();
            }
            var name = e.getAttribute("name");
            if (name == null) {
              name = e.getAttribute("ng-model");
              if (name == null) {
                name = "nameInput" + countInput;
                $(e).attr("name", name);
              } else {
                $(e).attr("name", name);
              }
            }

            if (!validation.rules[name]) {
              validation.rules[name] = {};
            }
            if (!validation.messages[name]) {
              validation.messages[name] = {};
            }

            if (e.hasAttribute('required')) {
              validation.rules[name].required = true;
              validation.messages[name].required = a_language.valid_required;
            }

            if (e.hasAttribute('check-email')) {
              validation.rules[name].email = true;
              validation.messages[name].email = a_language.valid_email;
            }

            if (e.hasAttribute('check-phone')) {
              validation.rules[name].phone = true;
              validation.messages[name].phone = a_language.valid_phone;
            }

            if (e.hasAttribute("check-link")) {
              validation.rules[name].link = true;
              validation.messages[name].link = a_language.valid_link;
            }

            if (e.hasAttribute("check-imageLink")) {
              validation.rules[name].imageLink = true;
              validation.messages[name].imageLink = a_language.valid_imageLink;
            }

            if (e.hasAttribute("required-select2")) {
              validation.rules[name].requiredSelect2 = "";
              validation.messages[name].requiredSelect2 = a_language.valid_required;
            }

            if (e.hasAttribute("check-sign")) {
              validation.rules[name].sign = true;
              validation.messages[name].sign = a_language.valid_sign;
            }

            if (e.hasAttribute("check-space")) {
              validation.rules[name].space = true;
              validation.messages[name].space = a_language.valid_space;
            }

            if (e.hasAttribute("check-script")) {
              validation.rules[name].script = true;
              validation.messages[name].script = a_language.valid_script;
            }

            if (e.hasAttribute("check-az09")) {
              validation.rules[name].az09 = true;
              validation.messages[name].az09 = a_language.valid_az09;
            }

            if (e.hasAttribute("check-textFirst")) {
              validation.rules[name].textFirst = true;
              validation.messages[name].textFirst = a_language.valid_textFirst;
            }

            if (e.hasAttribute("check-dateTime")) {
              validation.rules[name].dateTime = true;
              validation.messages[name].dateTime = a_language.valid_dateTime;
            }

            if (e.hasAttribute("check-date")) {
              validation.rules[name].date = true;
              validation.messages[name].date = a_language.valid_date;
            }
            if (e.hasAttribute("check-year")) {
              validation.rules[name].year = true;
              validation.messages[name].year = a_language.valid_year;
            }
            if (e.hasAttribute("check-month")) {
              validation.rules[name].month = true;
              validation.messages[name].month =a_language.valid_month;
            }
            
            if (e.hasAttribute("required-summernote")) {
              validation.rules[name].summernote = "";
              validation.messages[name].summernote = a_language.valid_required;
            }
            if (e.hasAttribute("required-ckeditor")) {
              validation.rules[name].ckeditor = "";
              validation.messages[name].ckeditor = a_language.valid_required;
            }
            
            if (e.hasAttribute("check-int")) {
              validation.rules[name].int = true;
              validation.messages[name].int = a_language.valid_int;
            }

            if (e.hasAttribute("check-float")) {
              validation.rules[name].float = true;
              validation.messages[name].float = a_language.valid_float;
            }

            if (e.hasAttribute("check-tuNgay")) {
              validation.rules[name].tuNgay = true;
              validation.messages[name].tuNgay = a_language.valid_tuNgay;
            }

            if (e.hasAttribute("check-denNgay")) {
              validation.rules[name].denNgay = true;
              validation.messages[name].denNgay = a_language.valid_denNgay;
            }

            if (e.hasAttribute("pattern")) {
              validation.rules[name].pattern = e.getAttribute('pattern');
              validation.messages[name].pattern = "Giá trị không hợp lệ.";
            }

            if (e.hasAttribute('min')) {
              validation.rules[name].min = parseInt(e.getAttribute("min"));
              validation.messages[name].min = a_language.valid_min + " " + e.getAttribute('min');
            }
            if (e.hasAttribute('max')) {
              validation.rules[name].max = parseInt(e.getAttribute("max"));
              validation.messages[name].max = a_language.valid_max + " " + e.getAttribute('max');
            }

            if (e.hasAttribute("check-maxLength")) {
              validation.rules[name].maxlength = parseInt(e.getAttribute("check-maxLength"));
              validation.messages[name].maxlength = a_language.valid_max + " " + e.getAttribute("check-maxLength") + " " + a_language.valid_character;
            }            

            if (e.hasAttribute("check-minLength")) {
              validation.rules[name].minlength = parseInt(e.getAttribute("check-minLength"));
              validation.messages[name].minlength = a_language.valid_min + " " + e.getAttribute("check-minLength") + " " + a_language.valid_character;
            }

            if (e.hasAttribute("check-length")) {
              validation.rules[name].length = parseInt(e.getAttribute("check-length"));
              validation.messages[name].length = a_language.valid_length + " " + e.getAttribute("check-length") + " " + a_language.valid_character;
            }

            if (e.hasAttribute('require-upload') && e.getAttribute('require-upload') != "undefined") {
              validation.rules[name].requiredUpload = e.getAttribute('require-upload');
              validation.messages[name].requiredUpload = a_language.valid_requiredUpload + " " + e.getAttribute('require-upload') + " " + a_language.valid_file;
            }

          });

          $scope.validator = myApp.validateForm($element, validation);

          $scope.resetForm = function reset() {
            $element.find('.has-error').removeClass('has-error');
            $scope.validator.resetForm();
          }

          //enter datepicker don't validate form
          $element.on('keypress', 'input', function (e) {
            if (e.keyCode == 13) {
              if ($scope.allowSubmitEnter != undefined) {
              }
              else {
                e.preventDefault();
                return;
              }
            }
          });

          // btn tạo
          $element.delegate("[my-button-create]", "click", function (e) {
            setTimeout(function () {
              if ($scope.validator.form()) {
                $scope.createFunction();
              } else {
                //stop loading button
                Ladda.stopAll();
                $scope.validator.focusInvalid();
              }
            }, 300);
          });

          // btn lưu
          $element.delegate("[my-button-update]", "click", function (e) {
            setTimeout(function () {
              if ($scope.validator.form()) {
                $scope.updateFunction();
              } else {
                //stop loading button
                Ladda.stopAll();
                $scope.validator.focusInvalid();
              }
            }, 300);
          });

          // btn hủy
          $element.delegate("[my-button-cancel]", "click", function (e) {
            $scope.resetForm();
            $scope.cancelFunction();
          });
        }, 300);

      }
    }
  });
})();
