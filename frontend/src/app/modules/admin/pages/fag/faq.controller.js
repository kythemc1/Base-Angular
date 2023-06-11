(function () {
  "use strict";
  angular
    .module("MyApp")
    .controller("faq.Controller", function ($rootScope, $scope, $timeout, $q, $state, $stateParams, $compile, AuthService, ApiService, APP_CONFIG) {

      var a_language = APP_CONFIG.languageConfig.language;
      var a_userInfo = APP_CONFIG.userInfo;

      $scope.module = "faq";
      $scope.route = "admin." + $scope.module;
      $scope.modelForm = "dataForm";
      $scope.modelSearch = "dataSearch";

      $scope.currentScope = $scope;

      $scope.attrForm = [
        [{
          name: "question",
          col: "12",
          required: true,
          ngDisabled: "viewMode == 'detail'",
          type: "text",
        }], [
          {
            name: "index",
            col: "2",
            required: true,
            ngDisabled: "viewMode == 'detail'",
            type: "number-integer",
          },
          {
            name: "visible",
            col: "4",
            required: false,
            ngDisabled: "viewMode == 'detail'",
            type: "checkbox",
          }],
        [{
          name: "answer",
          col: "12",
          required: true,
          ngDisabled: "viewMode == 'detail'",
          type: "ckeditor",
        }]
      ];

      $scope.attrSearch = [
        [
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
          },
          {
            name: "visible",
            col: "2",
            type: "checkbox",
          }]
      ];

      $scope.viewMode = "";

      $scope.$on("$viewContentLoaded", function () {
        if ($state.current.name == $scope.route + ".list") {
          $scope.initTable();
        } else {
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
          type: "partialUpdate",
          value: $scope[$scope.modelForm]
        }
        ApiService.send(api);
      };

      $scope.getList = function (callback, objFilter) {
        let api = {
          module: $scope.module,
          type: "list",
          value: objFilter
        }
        ApiService.send(api).then(function (res) {
          callback(res, res.info.meta.total);
        });
      };


      $scope.openModalForm = function (typeForm, id) {
        if (typeForm == "create") {
          $scope.viewMode = "create";
          $scope.dataForm = {
            message: "Tôi rất hài lòng về sản phầm này",
            status: "new"
          }
          $scope.$apply();
        }
        else {
          if (typeForm == "update") {
            $scope.viewMode = "update";
          }
          if (typeForm == "detail") {
            $scope.viewMode = "detail";
          }
          let api = {
            module: $scope.module,
            type: "findById",
            value: { id: id }
          }
          ApiService.send(api).then(function (res) {
            $scope.$apply(function () {
              $scope[$scope.modelForm] = res.data;
            });
          });
        }
        $("#" + $scope.module + "-modal").modal("show");
      };

      $scope.initTable = function () {
        $scope.config = {
          module: $scope.module,
          route: $scope.route,
          hiddenParamUrl: true,
          allowSelect: true,
          ordering: true,
          paging: true,
          lengthMenu: [10, 25, 50, 100, 500, 700, 1000],
          filter: false,
          info: true,
          allowDrag: "index",
          orderDefault: ["index", "asc"],
          allowUpdate: $state.current.update,
          allowButtons: ['create', 'delete'],
          allowActions: ["view", "update", "delete"],
          // allowOpenModal: "openModalForm",
          customButtons: [],
          customList: "getList",
          customOperatorSearch: {
            "createdTime_from": ">=",
            "createdTime_to": "<="
          },
          columns: [

            {
              type: "stt"
            },
            {
              title: a_language[$scope.module + '_' + 'question'],
              data: "question",
              width: "200px",
              class: "text-center",
              type: "render",
              render: function (data) {
                return myApp.showTooltip(data, 30, false);
              }
            },
            {
              title: a_language[$scope.module + '_' + 'answer'],
              data: "answer",
              width: "auto",
              type: "render",
              render: function (data) {
                return myApp.showTooltip(data, 50, false);
              }
            },
            {
              title: a_language[$scope.module + '_' + 'visible'],
              data: "visible",
              width: "80px",
              class: "text-center",
              render: function (data) {
                if (data) {
                  return `<i class="fa fa-check"></i>`;
                }
              }
            },
            {
              title: a_language[$scope.module + '_' + 'index'],
              data: "index",
              width: "80px",
              class: "text-center",
              type: "drag",
            },
          ]
        };
      };

    });
})();

