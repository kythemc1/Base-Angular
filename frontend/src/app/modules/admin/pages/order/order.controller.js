(function () {
  "use strict";
  angular
    .module("MyApp")
    .controller("order.Controller", function ($rootScope, $scope, $timeout, $q, $state, $stateParams, $compile, AuthService, ApiService, APP_CONFIG) {

      var a_language = APP_CONFIG.languageConfig.language;
      var a_userInfo = APP_CONFIG.userInfo;
      $scope.module = "order";
      $scope.route = "admin." + $scope.module;
      $scope.modelForm = "dataForm";
      $scope.modelSearch = "dataSearch";

      $scope.currentScope = $scope;

      $scope.attrForm = [
        [{
          name: "firstname",
          col: "4",
          required: true,
          ngDisabled: "viewMode == 'detail'",
          type: "text",
        },
        {
          name: "lastname",
          col: "4",
          required: true,
          ngDisabled: "viewMode == 'detail'",
          type: "text",
        },
        {
          name: "phoneNumber",
          col: "4",
          required: true,
          ngDisabled: "viewMode == 'detail'",
          type: "text",
        }
        ],
        [
          {
            name: "email",
            col: "4",
            required: true,
            ngDisabled: "viewMode == 'detail'",
            type: "text"
          },
          {
            name: "country",
            col: "4",
            required: false,
            ngDisabled: "viewMode == 'detail'",
            type: "text",
            model: `${$scope.modelForm}.address.country`
          },
          {
            name: "city",
            col: "4",
            required: true,
            ngDisabled: "viewMode == 'detail'",
            type: "text",
            model: `${$scope.modelForm}.address.city`
          }],
        [
          {
            name: "state",
            col: "4",
            required: true,
            ngDisabled: "viewMode == 'detail'",
            type: "text",
            model: `${$scope.modelForm}.address.state`
          },
          {
            name: "line1",
            col: "4",
            required: false,
            ngDisabled: "viewMode == 'detail'",
            type: "text",
            model: `${$scope.modelForm}.address.line1`
          },
          {
            name: "line2",
            col: "4",
            required: false,
            ngDisabled: "viewMode == 'detail'",
            type: "text",
            model: `${$scope.modelForm}.address.line2`
          }],
        [
          {
            name: "postcode",
            col: "3",
            required: false,
            ngDisabled: "viewMode == 'detail'",
            type: "text",
            model: `${$scope.modelForm}.address.postcode`
          },
          {
            name: "productName",
            col: "3",
            required: true,
            ngDisabled: "viewMode == 'detail'",
            type: "text",
            model: `${$scope.modelForm}.detail[0].productName`
          },
          {
            name: "quantity",
            col: "3",
            required: true,
            ngDisabled: "viewMode == 'detail'",
            type: "number-integer",
            model: `${$scope.modelForm}.detail[0].quantity`
          },
          {
            name: "price",
            col: "3",
            required: true,
            ngDisabled: "viewMode == 'detail'",
            type: "number-float",
            model: `${$scope.modelForm}.detail[0].price`
          }],
        [
          {
            name: "shippingPrice",
            col: "3",
            required: true,
            ngDisabled: "viewMode == 'detail'",
            type: "number-float",
            valid: "min='1'",
          },
          {
            name: "discountPrice",
            col: "3",
            required: true,
            ngDisabled: "viewMode == 'detail'",
            type: "number-float",
            valid: "min='0'",
          }
        ],
      ];

      $scope.attrSearch = [
        [

          {
            name: "firstname",
            col: "3",
            type: "text",
          },
          {
            name: "lastname",
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
        } else {
          if ($state.current.name == $scope.route + ".create") {
            $scope.viewMode = "create";
            $scope.dataForm = {
              address: {
                country: "Australia",
              },
              detail: [{
                productName: "Sitmo device",
                quantity: 1,
                price: 172,

              }],
              shippingPrice: 7.99,
              discountPrice: 0
            };
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
            });
          }
        }
      });

      $scope.search = function () {
        // hàm được viết trong myTable
        $rootScope.searchDataTable();
      };

      $scope.clearSearch = function () {
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
          type: "list",
          value: objFilter
        }
        ApiService.send(api).then(function (res) {
          callback(res, res.info.meta.total);
        });
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
          orderDefault: ["firstname", "asc"],
          allowUpdate: $state.current.update,
          allowButtons: ["delete", "create", "filter"],
          allowActions: ["view", "update", "delete"],
          customButtons: [],
          customList: null,
          customOperatorSearch: {
            "firstname": ":regex:",
            "lastname": ":regex:",
            "createdTime_from": ">=",
            "createdTime_to": "<="
          },
          columns: [
            {
              type: "stt"
            },
            {
              title: a_language[$scope.module + '_' + 'firstname'],
              data: "firstname",
              width: "auto",
              class: "text-center",
              render: function (data) {
                return myApp.showTooltip(data, 10, false);
              },
              type: "render"
            },
            {
              title: a_language[$scope.module + '_' + 'lastname'],
              data: "lastname",
              width: "40%",
            },
            {
              title: a_language[$scope.module + '_' + 'createdTime'],
              data: "createdTime",
              width: "200px",
              type: "date"
            },
          ]
        };
      };

    });
})();

