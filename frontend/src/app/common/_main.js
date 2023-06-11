/***
Metronic AngularJS App Main Script
***/
(function () {
  'use strict';
  angular.module("Auth", []);
  window.MyApp = angular.module("MyApp", [
    "ui.router",
    "ui.bootstrap",
    "ngSanitize",
    'pascalprecht.translate',
    "restangular",
    "Auth"
  ]);

  MyApp.config(['$translateProvider', 'APP_CONFIG', '$stateProvider', '$urlRouterProvider', '$locationProvider', 'RestangularProvider', '$controllerProvider',
    function ($translateProvider, APP_CONFIG, $stateProvider, $urlRouterProvider, $locationProvider, RestangularProvider, $controllerProvider) {

      /* Setup language */
      $translateProvider.translations('vi', APP_CONFIG.languageConfig.translations_vi);
      $translateProvider.translations('en', APP_CONFIG.languageConfig.translations_en);
      $translateProvider.preferredLanguage(MyConfig.language);
      // Enable escaping of HTML
      $translateProvider.useSanitizeValueStrategy('escape');

      /* Setup Rounting For All Pages */
      $locationProvider.hashPrefix(''); // by default '!'
      $locationProvider.html5Mode(true);
      $urlRouterProvider.otherwise("/admin/home");

      //AngularJS v1.3.x workaround for old style controller declarition in HTML
      $controllerProvider.allowGlobals();

    }
  ]);

  /* Setup global settings */
  MyApp.factory('settings', ['$rootScope', function ($rootScope, $state) {

    var path = MyConfig.basePath;
    var location_origin = window.location.origin + path;
    var settings = {
      layout: {
        pageSidebarClosed: false, // sidebar menu state
        pageContentWhite: true, // set page content layout
        pageBodySolid: false, // solid body color state
        pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
      },
      assetsPath: path + '/assets',
      globalPath: path + '/assets/global',
      layoutPath: path + '/assets/layouts/layout2',
      imgPath: path + '/img',
      location_origin: location_origin
    };
    return settings;
  }]);

  /* Init global settings and run the app */
  MyApp.run(["$rootScope", "settings", "$state", "Restangular", "AuthService", "$location", "$translate", "APP_CONFIG",
    function ($rootScope, settings, $state, Restangular, AuthService, $location, $translate, APP_CONFIG) {
      $rootScope.$state = $state;
      $rootScope.$settings = settings;
      $rootScope.requestCount = 0;
      $rootScope.AppStates = $state.get();
      $rootScope.routeConfig = [];

      $rootScope.MyInfo = {};
      $rootScope.MyInfo.menuConfig = APP_CONFIG.menuConfig;
      $rootScope.MyInfo.userInfo = APP_CONFIG.userInfo;
      $rootScope.MyInfo.language = APP_CONFIG.languageConfig.language;
      
      var a_language = APP_CONFIG.languageConfig.language;

      //function change language
      /* $rootScope.changeLanguage = function (language) {
        $translate.use(language);
      }; */

      //----------phần check quyền----------

      //thêm quyền truy cập, quyền sửa vào routes
      $rootScope.AppStates.forEach(state => {
        let value = AuthService.checkFunctionRoute(APP_CONFIG.menuConfig, state.name);
        if(value){
          state.access = value.access;
          state.update = value.update;

          $rootScope.routeConfig.push({
            stateName: state.name,
            access: value.access,
            update: value.update
          });          
        }
        
      });

      //check quyền truy cập module
      var checkRoute = function (event, toState, toParams, fromState, fromParams) {
        if (toState && toState.name != "admin.home") {
          var flag = false;

          //kiểm tra xem toState có quyền truy cập không
          for(let i = 0; i< $rootScope.routeConfig.length; i++){
            let state = $rootScope.routeConfig[i];
            if(state.stateName == toState.name){
              flag = true;
              break;
            }
          }
          if(!flag){
            event.preventDefault();
            toastr.error(a_language.c_notAllowAccess);
          }
        }
      };

      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        //xóa modal, datepicker, select2 đang hiển thị khi back brower
        if ($('.modal').hasClass('in')) {
          $('.modal').modal('hide');
          $(".modal-backdrop").remove();
        }
        if ($(".datepicker").hasClass('datepicker-dropdown')) {
          $(".datepicker").remove();
        }
        if ($(".select2-container").hasClass('select2-container--open')) {
          $(".select2-container").remove();
        }
        $(".page-sidebar .nav-item").removeClass("open");

        if (toState.name.indexOf("admin") != -1) {
          if (APP_CONFIG.userInfo) {
            checkRoute(event, toState, toParams, fromState, fromParams);
          } else {

            //dừng tiến trình go state khác
            event.preventDefault();
            
            toastr.error(a_language.c_loginAgain);
            $state.go("auth.login");
          }
        }
        
      });


      //----------end phần check quyền----------

      mushroom._on("beginRequest", function (arg) {
        if ($rootScope.requestCount == 0) {
          App.blockUI();
        }
        $rootScope.requestCount += 1;
      });

      mushroom._on("endRequest", function () {
        $rootScope.requestCount -= 1;
        if ($rootScope.requestCount == 0) {
          App.unblockUI();
          //stop loading button
          Ladda.stopAll();
        }
      });



    }
  ])

})();
