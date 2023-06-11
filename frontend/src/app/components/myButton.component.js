
(function () {
  "use strict";
  angular.module("MyApp").directive('myButtonUpdate', function ($compile, ApiService, APP_CONFIG) {
    return {
      restrict: 'E',
      scope: {
        mText: '@',
        mClass: "@"
      },
      link: function ($scope, $element, $attrs) {
        var a_language = APP_CONFIG.languageConfig.language;
        var btnText = a_language.c_update;

        var btnClass = "btn btn-sm mt-ladda-btn ladda-button margin-left-5 margin-right-5";
        if ($scope.mText) {
          btnText = $scope.mText;
        }
        if ($scope.mClass) {
          btnClass = btnClass +" "+ $scope.mClass;          
        }
        else{
          btnClass = btnClass + " dt-button";
        }
        $element.append(`<button my-button-update class="${btnClass}" data-style="slide-left" data-spinner-color="#333">
        ${btnText}</button>`);
        Ladda.bind("button[my-button-update]");
      }
    }
  })
})();


(function () {
  "use strict";
  angular.module("MyApp").directive('myButtonCreate', function ($compile, ApiService, APP_CONFIG) {
    return {
      restrict: 'E',
      scope: {
        mText: '@',
        mClass: "@"
      },
      link: function ($scope, $element, $attrs) {
        var a_language = APP_CONFIG.languageConfig.language;
        var btnText = a_language.c_create;
        var btnClass = "btn btn-sm mt-ladda-btn ladda-button margin-left-5 margin-right-5";
        if ($scope.mText) {
          btnText = $scope.mText;
        }
        if ($scope.mClass) {
          btnClass = btnClass +" "+ $scope.mClass;
        }
        else{
          btnClass = btnClass + " dt-button";
        }
        $element.append(`<button my-button-create class="${btnClass}" data-style="slide-left" data-spinner-color="#333">
        ${btnText}</button>`);
        Ladda.bind("button[my-button-create]");
      }
    }
  })
})();

(function () {
  "use strict";
  angular.module("MyApp").directive('myButtonCancel', function ($compile, ApiService, APP_CONFIG) {
    return {
      restrict: 'E',
      scope: {
        mText: '@',
        mClass: "@"
      },
      link: function ($scope, $element, $attrs) {
        var a_language = APP_CONFIG.languageConfig.language;
        var btnText = a_language.c_close;
        var btnClass = "btn btn-sm mt-ladda-btn ladda-button margin-left-5 margin-right-5";
        if ($scope.mText) {
          btnText = $scope.mText;
        }
        if ($scope.mClass) {
          btnClass = btnClass +" "+ $scope.mClass;
        }
        else{
          btnClass = btnClass + " dt-button";
        }
        $element.append(`<button my-button-cancel class="${btnClass}" data-style="slide-left" data-spinner-color="#333">
        ${btnText}</button>`);
        Ladda.bind("button[my-button-cancel]");
      }
    }
  })
})();

(function () {
  "use strict";
  angular.module("MyApp").directive('myLaddaButton2', function ($compile, ApiService, APP_CONFIG) {
    return {
      restrict: 'E',
      scope: {
        mText: '@',
        mClass: "@"
      },
      link: function ($scope, $element, $attrs) {
        var a_language = APP_CONFIG.languageConfig.language;
        var btnText = a_language.c_close;
        var btnClass = "btn btn-sm mt-ladda-btn ladda-button margin-left-5 margin-right-5";
        if ($scope.mText) {
          btnText = $scope.mText;
        }
        if ($scope.mClass) {
          btnClass = btnClass +" "+ $scope.mClass;
        }
        else{
          btnClass = btnClass + " dt-button";
        }
        $element.append(`<button my-ladda-button class="${btnClass}" data-style="slide-left" data-spinner-color="#333">
        ${btnText}</button>`);
        Ladda.bind("button[my-ladda-button]");
      }
    }
  })
})();