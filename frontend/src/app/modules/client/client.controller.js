(function () {
  "use strict";
  angular
    .module("MyApp")
    .controller("client.Controller", function ($rootScope, $scope, $timeout, $q, $state, $stateParams, $compile, AuthService, ApiService, APP_CONFIG) {

      var a_language = APP_CONFIG.languageConfig.language;
      var a_userInfo = APP_CONFIG.userInfo;

      $scope.module = "client";
      $scope.route = $scope.module;
      $scope.modelForm = "dataForm";
      $scope.modelSearch = "dataSearch";
      $scope.currentScope = $scope;

      $scope.$on("$viewContentLoaded", function () { });

      $scope.attrForm = [
        [{
          name: "hvt",
          col: "4",
          required: false,
          ngDisabled: false,
          type: "text",
        },
        {
          name: "sdt",
          col: "4",
          required: false,
          ngDisabled: false,
          type: "text",
        },
        {
          name: "ns",
          col: "4",
          required: false,
          ngDisabled: false,
          type: "date",
        },
        ],
        [
          {
            name: "ttp",
            col: "4",
            required: false,
            ngDisabled: false,
            type: "select",
            mOption: "listProvince",
            mKeytotext: "name",
            mKeytoid: "ma",
          },
          {
            name: "qh",
            col: "4",
            required: false,
            ngDisabled: false,
            type: "text",

          },
          {
            name: "xt",
            col: "4",
            required: false,
            ngDisabled: false,
            type: "text",

          }
        ],
        [
          {
            name: "scmnd",
            col: "4",
            required: false,
            ngDisabled: false,
            type: "text",

          },
          {
            name: "hktt",
            col: "4",
            required: false,
            ngDisabled: false,
            type: "text",

          },
          {
            name: "tthcs",
            col: "4",
            required: false,
            ngDisabled: false,
            type: "text",

          }
        ],
        [
          {
            name: "bdtn",
            col: "4",
            required: false,
            ngDisabled: false,
            type: "text",

          },
          {
            name: "ntn",
            col: "4",
            required: false,
            ngDisabled: false,
            type: "text",

          },
          {
            name: "dtkhb",
            col: "4",
            required: false,
            ngDisabled: false,
            type: "text",

          }
        ],
        [
          {
            name: "bmxt",
            col: "4",
            required: false,
            ngDisabled: false,
            type: "text",

          },
          {
            name: "nv1",
            col: "4",
            required: false,
            ngDisabled: false,
            type: "text",

          },
          {
            name: "nv2",
            col: "4",
            required: false,
            ngDisabled: false,
            type: "text",

          }
        ],

        [
          {
            name: "gc",
            col: "12",
            required: false,
            ngDisabled: false,
            type: "text",

          },
          {
            name: "dt",
            col: "4",
            required: false,
            ngDisabled: false,
            type: "text",

          },
          {
            name: "lfb",
            col: "8",
            required: false,
            ngDisabled: false,
            type: "text",

          }
        ],

      ];

      $scope.listProvince =
        [{
          ma: "hn",
          name: "Hà Nội"
        },
        {
          ma: "hcm",
          name: "Hồ Chí Minh"
        }];

    });
})();
