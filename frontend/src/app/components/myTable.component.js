(function () {
  "use strict";

  angular.module("MyApp").directive('myTable', function ($compile, ApiService, APP_CONFIG) {
    return {
      restrict: "E",  //element
      scope: {
        id: "@",
        mConfig: "=",
        mSearch: "="
      },
      template: `<table class="table table-bordered table-advance table-hover dataTable"><thead></thead><tbody></tbody></table>`,
      controller: function ($rootScope, $scope, $element, $state, $location, $window) {
        var a_language = APP_CONFIG.languageConfig.language;
        function init() {
          $scope.urlParams = Object.assign({}, $location.$$search);

          /* kiểm tra cùng controller */
          if ($rootScope.historyDataTable && $rootScope.historyDataTable.controller == $state.current.controller) {
            $scope.urlParams = $rootScope.historyDataTable.url;
          }
          else {
            $rootScope.historyDataTable = {};
            if ($scope.mConfig.paging) {
              $scope.urlParams.limit = $location.$$search.limit ? parseInt($location.$$search.limit) : $scope.mConfig.lengthMenu ? $scope.mConfig.lengthMenu[0] : 10;
              $scope.urlParams.page = $location.$$search.page ? parseInt($location.$$search.page) : 1;
              $scope.urlParams.offset = ($scope.urlParams.page - 1) * $scope.urlParams.limit;
            }
            if ($scope.mConfig.ordering) {
              $scope.urlParams.sort = $location.$$search.sort && $location.$$search.sort != "" ? $location.$$search.sort : $scope.mConfig.orderDefault[0];
              $scope.urlParams.sortType = $location.$$search.sortType && $location.$$search.sort != "" ? $location.$$search.sortType : $scope.mConfig.orderDefault[1];
            }

            if ($scope.mConfig.filter) {
              $scope.urlParams.filter = "open";
            }
          }

          //for columns
          for (let i = 0; i < $scope.mConfig.columns.length; i++) {
            let item = $scope.mConfig.columns[i];
            item.defaultContent = "";

            //set orderNumber
            if ($scope.mConfig.ordering) {
              if ($scope.urlParams.sort) {
                if (item.data == $scope.urlParams.sort) {
                  $scope.mConfig.orderNumber = i;
                }
              }
              else {
                if (item.data == $scope.mConfig.orderDefault[0]) {
                  $scope.mConfig.orderNumber = i;
                }
              }
            }
            else {
              $scope.mConfig.orderNumber = 0;
            }

            if (item.type == "stt") {
              item.title = a_language.datatable_stt;
              item.orderable = false;
              item.className = "text-center";
              item.width = "20px";
              item.render = function (data, type, full, meta) {
                return (meta.row + 1) + parseInt(meta.settings._iDisplayStart);
              };
            }

            if (item.type == "date") {
              item.className = "text-center";
              item.render = function (data) {
                return moment(data).format('DD/MM/YYYY');
              };
            }

            if (item.type == "datetime") {
              item.className = "text-center";
              item.render = function (data) {
                return moment(data).format('DD/MM/YYYY HH:MM:SS');
              };
            }

            if (item.type == "datetimehour") {
              item.className = "text-center";
              item.render = function (data) {
                return moment(data).format('DD/MM/YYYY HH:mm');
              };
            }

            //check sắp xếp cột theo quyền sửa
            if (item.type == "drag") {
              if (!item.class) {
                item.class = "";
              }
              if ($scope.mConfig.allowUpdate && $scope.mConfig.allowDrag) {
                item.class = item.class + " datatable-drag";
                item.render = function (data) {
                  return `<div class="tooltipster" title="${a_language.c_drag}">${data}</div>`;
                };
                item.fnCreatedCell = function (celContent, sData) {
                  $compile(celContent)($scope);
                };
              }
            }

            if (item.type == "render") {
              item.fnCreatedCell = function (celContent, sData) {
                $compile(celContent)($scope);
              };
            }
          }

          $scope.mSearch = Object.assign({}, $scope.urlParams);
          delete $scope.mSearch.limit;
          delete $scope.mSearch.page;
          delete $scope.mSearch.offset;
          delete $scope.mSearch.sort;
          delete $scope.mSearch.sortType;
          delete $scope.mSearch.filter;


          if ($scope.urlParams.filter == "open") {
            initFilter("open");
            $scope.urlParams.filter = "open";
          }

          function initFilter(mode) {
            if (mode == "open") {
              if (!$(".panel-collapse").hasClass("in")) {
                toggleTableFilter();
              }
            } else {
              if ($(".panel-collapse").hasClass("in")) {
                toggleTableFilter();
              }
            }
          };

          function toggleTableFilter() {
            $("a.accordion-toggle").trigger("click");
            if ($scope.urlParams.filter == "open") {
              $scope.urlParams.filter = "close";
            } else {
              $scope.urlParams.filter = "open";
            }
          };

          function locationSearch() {
            if (!$scope.mConfig.hiddenParamUrl) {
              $location.search($scope.urlParams);
            }
          };

          function applyLocationSearch() {
            if (!$scope.mConfig.hiddenParamUrl) {
              $location.search($scope.urlParams);
              $scope.$apply();
            }
          };

          locationSearch();

          //khởi tạo
          var options = {
            serverSide: true, //để khi sắp xếp sẽ gọi lại ajax
            info: $scope.mConfig.info ? $scope.mConfig.info : false,
            paging: $scope.mConfig.paging ? $scope.mConfig.paging : false,
            pagingType: "full_numbers",
            autoWidth: false,
            processing: $scope.mConfig.processing ? $scope.mConfig.processing : false, //hiện loading
            lengthMenu: $scope.mConfig.lengthMenu ? $scope.mConfig.lengthMenu : [10, 25, 50, 100, 500, 700, 1000],
            iDisplayLength: $scope.urlParams.limit,
            iDisplayStart: $scope.urlParams.offset,
            ordering: $scope.mConfig.ordering ? $scope.mConfig.ordering : false,
            order: [[$scope.mConfig.orderNumber, $scope.urlParams.sortType]],
            language: {
              lengthMenu: "_MENU_",
              info: a_language.datatable_sum + " _TOTAL_ " + a_language.datatable_record,
              infoEmpty: "",
              emptyTable: a_language.datatable_emptyValue,
              infoFiltered: "",
              zeroRecords: a_language.datatable_emptyValue,
              processing: a_language.datatable_loading,
              paginate: {
                first: `<i class="fa fa-angle-double-left" aria-hidden="true"></i>`,
                last: `<i class="fa fa-angle-double-right" aria-hidden="true"></i>`,
                next: `<i class="fa fa-angle-right" aria-hidden="true"></i>`,
                previous: `<i class="fa fa-angle-left" aria-hidden="true"></i>`,
              }
            },
            dom: `<'row'<'col-md-1 col-sm-1'l><'col-md-11 col-sm-11'B<'table-group-actions pull-right'>>r>t<'row'<'col-md-5 col-sm-5 text-right'i><'col-md-7 col-sm-7 text-center'p><'col-md-4 col-sm-12'>>`,

            columns: $scope.mConfig.columns,
            buttons: [],
          };

          //khai báo chức năng mặc định
          var buttons = {
            btnDelete: {
              text: `<i class="fa fa-trash"></i> ${a_language.c_delete}`,
              action: function () {
                let item = datatable_init.rows({
                  selected: true
                }).data();
                if (item && item.length > 0) {
                  swal.show('confirm', a_language.c_deleteConfirm, '', function (confirm) {
                    if (confirm) {
                      let ids = [];
                      for (let i = 0; i < item.length; i++) {
                        ids.push(item[i].id);
                      }
                      let api = {
                        module: $scope.mConfig.module,
                        type: "batchDelete",
                        value: ids
                      }
                      ApiService.send(api).then(function (res) {
                        datatable_init.draw();
                      });
                    }
                  });
                }
                else {
                  toastr.info(a_language.c_emptyRecord);
                }
              },
              className: "btn"
            },
            btnAdd: {
              text: `<i class="fa fa-plus"></i> ${a_language.c_create}`,
              action: function () {
                if ($scope.mConfig.allowOpenModal) {
                  $scope.$parent[$scope.mConfig.allowOpenModal]("create");
                }
                else {
                  $rootScope.historyDataTable = {
                    url: $scope.urlParams,
                    controller: $state.current.controller
                  };
                  $state.go(`${$scope.mConfig.route}.create`);
                }

              },
              className: "btn"
            },
            btnFilter: {
              text: `<i class="fa fa-search"></i> ${a_language.c_search}`,
              action: function () {
                $("a.accordion-toggle").trigger("click");
                if ($location.$$search.filter == "open") {
                  $scope.urlParams.filter = "close";
                }
                else {
                  $scope.urlParams.filter = "open";
                }
                applyLocationSearch();
              },
              className: "btn"
            },
            btnExcel: {
              text: `<i class="fa fa-download"></i> ${a_language.datatable_exportExcel}`,
              extend: 'excelHtml5',
              customize: function (xlsx) {
                var sheet = xlsx.xl.worksheets['sheet1.xml'];
                $('row:first c', sheet).attr('s', '42');
              },
              exportOptions: {
                columns: $scope.mConfig.excelColumn ? $scope.mConfig.excelColumn : undefined,
              },
              className: "btn",
              extension: ".xlsx"
            },
          };

          //check ẩn hiện button theo quyền sửa
          if ($scope.mConfig.allowUpdate) {
            if ($scope.mConfig.allowButtons && $scope.mConfig.allowButtons.indexOf('delete') > -1) {
              options.buttons.push(buttons.btnDelete);
            }

            if ($scope.mConfig.allowButtons && $scope.mConfig.allowButtons.indexOf('create') > -1) {
              options.buttons.push(buttons.btnAdd);
            }

            if ($scope.mConfig.allowButtons && $scope.mConfig.allowButtons.indexOf('filter') > -1) {
              options.buttons.push(buttons.btnFilter);
            }

            if ($scope.mConfig.allowButtons && $scope.mConfig.allowButtons.indexOf('excel') > -1) {
              options.buttons.push(buttons.btnExcel);
            }

            if ($scope.mConfig.customButtons && $scope.mConfig.customButtons.allowUpdate && $scope.mConfig.customButtons.allowUpdate.length > 0) {
              options.buttons.push($scope.mConfig.customButtons.allowUpdate);
            }

          } else {
            if ($scope.mConfig.allowButtons && $scope.mConfig.allowButtons.indexOf('filter') > -1) {
              options.buttons.push(buttons.btnFilter);
            }
            if ($scope.mConfig.allowButtons && $scope.mConfig.allowButtons.indexOf('excel') > -1) {
              options.buttons.push(buttons.btnExcel);
            }
            if ($scope.mConfig.customButtons && $scope.mConfig.customButtons.notAllowUpdate && $scope.mConfig.customButtons.notAllowUpdate.length > 0) {
              options.buttons.push($scope.mConfig.customButtons.notAllowUpdate);
            }
          }

          //khai báo thao tác mặc định
          $scope.action = {};
          $scope.action.update = function (id) {
            if ($scope.mConfig.allowOpenModal) {
              $scope.$parent[$scope.mConfig.allowOpenModal]("update", id);
            }
            else {
              $rootScope.historyDataTable = {
                url: $scope.urlParams,
                controller: $state.current.controller
              };
              $state.go(`${$scope.mConfig.route}.update`, {
                id: id,
              });
            }
          };
          $scope.action.detail = function (id) {
            if ($scope.mConfig.allowOpenModal) {
              $scope.$parent[$scope.mConfig.allowOpenModal]("detail", id);
            }
            else {
              $rootScope.historyDataTable = {
                url: $scope.urlParams,
                controller: $state.current.controller
              };
              $state.go(`${$scope.mConfig.route}.detail`, {
                id: id,
              });
            }
          };

          $scope.action.delete = function (id) {
            swal.show('confirm', a_language.c_deleteConfirm, '', function (confirm) {
              if (confirm) {
                let api = {
                  module: $scope.mConfig.module,
                  type: "delete",
                  value: {id:id}
                }
                ApiService.send(api).then(function (res) {
                  datatable_init.draw();
                });
              }
            });
          };

          //custom button action
          if ($scope.mConfig.customActions && $scope.mConfig.customActions.allowUpdate && $scope.mConfig.customActions.allowUpdate.length > 0) {
            $.each($scope.mConfig.customActions.allowUpdate, function (index, item) {
              $scope.action[item.nameActionFn] = $scope.$parent[item.nameActionFn];
            });
          }

          if ($scope.mConfig.customActions && $scope.mConfig.customActions.notAllowUpdate && $scope.mConfig.customActions.notAllowUpdate.length > 0) {
            $.each($scope.mConfig.customActions.notAllowUpdate, function (index, item) {
              $scope.action[item.nameActionFn] = $scope.$parent[item.nameActionFn];
            });
          }

          //check ẩn hiện action theo quyền sửa
          if (($scope.mConfig.allowActions && $scope.mConfig.allowActions.length > 0) || $scope.mConfig.customActions) {
            options.columns.push({
              data: "id",
              title: a_language.datatable_action,
              orderable: false,
              className: "text-center",
              width: 45 * (($scope.mConfig.allowActions ? $scope.mConfig.allowActions.length : 0) + ($scope.mConfig.customActions && $scope.mConfig.customActions.allowUpdate && $scope.mConfig.allowUpdate ? $scope.mConfig.customActions.allowUpdate.length : 0) + ($scope.mConfig.customActions && $scope.mConfig.customActions.notAllowUpdate && !$scope.mConfig.allowUpdate ? $scope.mConfig.customActions.notAllowUpdate.length : 0)) + 'px',
              render: function (data, type, full, meta) {

                let btnView = `<button class="btn btn-xs tooltipster" title="${a_language.c_view}" ng-click="action.detail('${data}')"><i class="fa fa-eye"></i></button>`;
                let btnUpdate = `<button class="btn btn-xs tooltipster" title="${a_language.c_update}" ng-click="action.update('${data}')"><i class="fa fa-pencil"></i></button>`;
                let btnDelete = `<button class="btn btn-xs tooltipster" title="${a_language.c_delete}" ng-click="action.delete('${data}')"><i class="fa fa-trash-o"></i></button>`;
                let buttons = "";
                if ($scope.mConfig.allowUpdate) {
                  if ($scope.mConfig.allowActions && $scope.mConfig.allowActions.indexOf('view') > -1) {
                    buttons += btnView;
                  }
                  if ($scope.mConfig.allowActions && $scope.mConfig.allowActions.indexOf('update') > -1) {
                    buttons += btnUpdate;
                  }
                  if ($scope.mConfig.allowActions && $scope.mConfig.allowActions.indexOf('delete') > -1) {
                    buttons += btnDelete;
                  }
                  if ($scope.mConfig.customActions && $scope.mConfig.customActions.allowUpdate && $scope.mConfig.customActions.allowUpdate.length > 0) {
                    $.each($scope.mConfig.customActions.allowUpdate, function (index, item) {
                      buttons += `<button class="btn btn-xs tooltipster" title="${item.title}" ng-click="action.${item.nameActionFn}('${data}')">${item.text}</button>`;
                    });
                  }

                } else {
                  if ($scope.mConfig.allowActions && $scope.mConfig.allowActions.indexOf('view') > -1) {
                    buttons += btnView;
                  }
                  if ($scope.mConfig.customActions && $scope.mConfig.customActions.notAllowUpdate && $scope.mConfig.customActions.notAllowUpdate.length > 0) {
                    $.each($scope.mConfig.customActions.notAllowUpdate, function (index, item) {
                      buttons += `<button class="btn btn-xs tooltipster" title="${item.title}" ng-click="action.${item.nameActionFn}('${data}')">${item.text}</button>`;
                    });
                  }
                }
                return buttons;
              },
              fnCreatedCell: function (celContent, sData) {
                $compile(celContent)($scope);
              }
            });
          }

          //check ẩn hiện checkbox select row
          if ($scope.mConfig.allowUpdate && $scope.mConfig.allowSelect) {
            options.order[0][0] = options.order[0][0] + 1;
            options.language.select = {
              rows: "%d bản ghi được chọn"
            };
            options.select = {
              style: 'multiple',
              selector: 'td:first-child'
            };
            $scope.mConfig.columns.unshift({
              title: "",
              data: null,
              orderable: false,
              className: 'select-checkbox',
              width: "15px",
              render: function () {
                return "";
              }
            });
          }

          //check quyền kéo thả
          if ($scope.mConfig.allowUpdate && $scope.mConfig.allowDrag) {
            options.rowReorder = {
              selector: "td.datatable-drag"
            }
          }

          options.ajax = function (data, callback, settings) {
            //cấu hình phương thức gọi api
            if ($scope.mConfig.paging) {
              $scope.urlParams.offset = settings._iDisplayStart;
              $scope.urlParams.limit = settings._iDisplayLength;
              $scope.urlParams.page = settings._iDisplayStart / settings._iDisplayLength + 1;
            }

            if ($scope.mConfig.ordering && settings.aaSorting.length > 0) {
              $scope.urlParams.sortType = settings.aaSorting[0][1];
              $scope.urlParams.sort = settings.aoColumns[settings.aaSorting[0][0]].data;
            }

            //xoá checkbox all
            if ($scope.mConfig.allowSelect) {
              $("th.select-checkbox").removeClass("selected");
            }

            var sortTypeList = "";
            if ($scope.urlParams.sortType == "asc") {
              sortTypeList = $scope.urlParams.sort;
            }
            if ($scope.urlParams.sortType == "desc") {
              sortTypeList = "-" + $scope.urlParams.sort;
            }

            var filter = "";
            //kiểm tra object.Search có rỗng k
            if (_.isEmpty($scope.mSearch)) {
              locationSearch();
            }

            else {
              var arrOperator = [];
              //xử lý filter
              Object.keys($scope.mSearch).map(function (key, index) {

                //cắt _to và _from
                var key2 = key;
                key2 = key.replace("_to", "");
                key2 = key2.replace("_from", "");

                if ($scope.mSearch[key] && $scope.mSearch[key] != "") {
                  if ($scope.mConfig.customOperatorSearch) {
                    if ($scope.mConfig.customOperatorSearch[key]) {
                      arrOperator.push(key2 + $scope.mConfig.customOperatorSearch[key] + $scope.mSearch[key]);
                    } else {
                      arrOperator.push(key2 + "=" + $scope.mSearch[key]);
                    }
                  }
                  else {
                    arrOperator.push(key2 + "=" + $scope.mSearch[key]);
                  }
                }


              });

              for (let i = 0; i < arrOperator.length; i++) {
                filter = filter + arrOperator[i] + "&";
              }
              //cắt dấu & cuối
              filter = filter.slice(0, -1);

              let objectNew = Object.assign({}, $scope.urlParams, $scope.mSearch);
              $scope.urlParams = objectNew;
              locationSearch();
            }

            var objFilter = {};

            objFilter.filters = filter;

            if ($scope.mConfig.paging) {
              objFilter.limit = $scope.urlParams.limit;
              objFilter.offset = $scope.urlParams.offset;
            }
            if ($scope.mConfig.ordering) {
              objFilter.sort = sortTypeList;
            }

            //truyền tham số search ra controller cha để xử lý list
            if ($scope.mConfig.customList) {
              $scope.$parent[$scope.mConfig.customList](function (res, total) {
                let value = {};
                value.recordsFiltered = total;
                value.recordsTotal = total;
                value.data = res.data;
                $scope.listData = res.data;
                callback(value);
              }, objFilter);
            }
            else {
              let api = {
                module: $scope.mConfig.module,
                type: "list",                
                value: objFilter
              }
              ApiService.send(api).then(function (res) {
                let value = {};
                value.recordsFiltered = res.info.meta.total;
                value.recordsTotal = res.info.meta.total;
                value.data = res.data;
                $scope.listData = res.data;
                callback(value);
              });
            }
          };

          //thêm dòng vào header
          if ($scope.mConfig.customHeader) {
            $element.context.innerHTML = `<table class="table table-bordered table-advance table-hover dataTable"><thead>${$scope.mConfig.customHeader}</thead><tbody></tbody></table>`
          }

          //kích hoạt table
          var datatable_init = $("#" + $scope.id + ">table").DataTable(options);

          //function tìm kiếm
          $rootScope.searchDataTable = function () {
            datatable_init.draw();
          };

          //function sắp xếp kéo thả
          datatable_init.on('row-reordered', function (e, diff, edit) {
            if ($scope.urlParams.sort == $scope.mConfig.orderDefault[0] && $scope.urlParams.sortType == "asc") {
              if (diff && diff.length > 0) {
                let countRes = diff.length;
                for (let i = 0; i < diff.length; i++) {
                  let row = diff[i];
                  row.position = row.newPosition - row.oldPosition;
                  $scope.listData[row.oldPosition][$scope.mConfig.allowDrag] = $scope.listData[row.oldPosition][$scope.mConfig.allowDrag] + row.position;
                  let dataUpdate = {}
                  dataUpdate.id = $scope.listData[row.oldPosition].id;
                  dataUpdate[$scope.mConfig.allowDrag] = $scope.listData[row.oldPosition][$scope.mConfig.allowDrag];

                  let api = {
                    module: $scope.mConfig.module,
                    type: "partialUpdate",
                    message: {
                      success: "hidden",
                      error: "hidden", 
                    },
                    value: dataUpdate
                  }
                  ApiService.send(api).then(function (res) {
                    countRes = countRes - 1;
                    if (countRes == 0) {
                      toastr.success(a_language.c_order + " " + a_language.c_record + " " + a_language.c_success);
                      datatable_init.draw();
                    }
                  }, function (error) {
                    countRes = countRes - 1;
                    if (countRes == 0) {
                      toastr.error(a_language.c_order + " " + a_language.c_record + " " + a_language.c_error);
                      datatable_init.draw();
                    }
                  })
                }
              }
            }
            else {
              toastr.info(a_language.datatable_alertOrder);
            }

          });



          datatable_init.on("click", "th.select-checkbox", function () {
            if ($("th.select-checkbox").hasClass("selected")) {
              datatable_init.rows().deselect();
              $("th.select-checkbox").removeClass("selected");
            } else {
              datatable_init.rows().select();
              $("th.select-checkbox").addClass("selected");
            }
          });

          datatable_init.on("select deselect", function () {
            if (datatable_init.rows({
              selected: true
            }).count() !== datatable_init.rows().count()) {
              $("th.select-checkbox").removeClass("selected");
            } else {
              $("th.select-checkbox").addClass("selected");
            }
          });

        };


        $scope.$watch("mConfig", function (newVal, oldVal) {
          if (newVal != undefined) {
            init();
          }
        });

      },

      link: function ($scope, $element, $attrs, controller) {

      },
    };
  });
})();
