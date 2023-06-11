(function () {
  "use strict";
  angular
    .module("MyApp")
    .controller("account.Controller", function ($rootScope, $scope, $timeout, $q, $state, $stateParams, $compile, AuthService, ApiService, APP_CONFIG) {

      var a_language = APP_CONFIG.languageConfig.language;
      var a_userInfo = APP_CONFIG.userInfo;
      $scope.module = "account";
      $scope.route = "admin." + $scope.module;
      $scope.modelForm = "dataForm";
      $scope.modelSearch = "dataSearch";

      $scope.currentScope = $scope;

      $scope.attrForm = [
        [{
          name: "firstName",
          col: "4",
          required: true,
          ngDisabled: "viewMode == 'detail'",
          type: "text",
        },
        {
          name: "lastName",
          col: "4",
          required: true,
          ngDisabled: "viewMode == 'detail'",
          type: "text",
        },
        {
          name: "phoneNumber",
          col: "3",
          required: false,
          ngDisabled: "viewMode == 'detail'",
          type: "text",
        },
        {
          name: "email",
          col: "3",
          required: false,
          ngDisabled: "viewMode == 'detail'",
          type: "text",
        }
        ],
        [
          {
            name: "devices",
            col: "12",
            required: true,
            ngDisabled: "viewMode == 'detail'",
            type: "textarea"
          }
        ],
      ];

      $scope.attrSearch = [
        [

          {
            name: "firstName",
            col: "3",
            type: "text",
          },
          {
            name: "lastName",
            col: "3",
            type: "text",
          },
          {
            title: "c_fromDate",
            name: "createdTime_from",
            col: "3",
            type: "date",
            valid: "check-date check-tuNgay"
          },
          {
            title: "c_toDate",
            name: "createdTime_to",
            col: "3",
            type: "date",
            valid: "check-date check-denNgay"
          }]
      ];

      $scope.viewMode = "";

      $scope.$on("$viewContentLoaded", function () {
        if ($state.current.name == $scope.route + ".list") {
          $scope.initTable();
        }
        else{
          if ($state.current.name == $scope.route + ".create") {
            $scope.viewMode = "create";
          } else {
            if ($state.current.name == $scope.route + ".update") {
              $scope.viewMode = "update";
            }
            if ($state.current.name == $scope.route + ".detail") {
              $scope.viewMode = "detail";
            }
            let api = {
              module: $scope.module,
              type: "findById",
              value: { id: $stateParams.id }
            }
            ApiService.send(api).then(function (res) {
              $scope.$apply(function () {
                $scope[$scope.modelForm] = res.data;
              });
            })
          }
        }
      });

      $scope.search = function () {
        // hàm được viết trong myTable
        $rootScope.searchDataTable();
      };

      $scope.clearSearch = function(){
        $scope[$scope.modelSearch] = {};
      }

      $scope.gotolist = function () {
        $state.go($scope.route + ".list");
      };

      $scope.create = function () {
        let api = {
          module: $scope.module,
          type: "create",
          value: $scope[$scope.modelForm]
        }
        ApiService.send(api);
      };

      $scope.update = function () {
        let api = {
          module: $scope.module,
          type: "partialUpdate",
          value: $scope[$scope.modelForm]
        }
        ApiService.send(api);
      };

      $scope.initTable = function () {
        $scope.config = {
          module: $scope.module,
          route: $scope.route,
          allowSelect: true,
          ordering: true,
          paging: true,
          lengthMenu: [10, 25, 50, 100, 500, 700, 1000],
          filter: true,
          info: true,
          allowDrag: false,
          orderDefault: ["firstName", "asc"],
          allowUpdate: $state.current.update,
          allowButtons: ["delete", "create", "filter"],
          allowActions: ["view", "update", "delete"],
          customButtons: [],
          customList: null,
          customOperatorSearch: {
            "firstName": ":regex:",
            "lastName": ":regex:",
            "createdTime_from": ">=",
            "createdTime_to": "<="
          },
          columns: [
            {
              type: "stt"
            },
            {
              title: a_language[$scope.module + '_' + 'firstName'],
              data: "firstName",
              width: "auto",
              render: function (data) {
                return myApp.showTooltip(data, 30, false);
              },
              type: "render"
            },
            {
              title: a_language[$scope.module + '_' + 'lastName'],
              data: "lastName",
              width: "200px",
              render: function (data) {
                return myApp.showTooltip(data, 50, false);
              },
              type: "render"
            },
            {
              title: a_language[$scope.module + '_' + 'phoneNumber'],
              data: "phoneNumber",
              width: "200px",
            },
          ]
        };
      };

    });
})();

