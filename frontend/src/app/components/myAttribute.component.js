(function () {
  "use strict";
  angular.module("MyApp").directive('myAttribute', function ($compile, $q) {
    return {
      restrict: 'E',
      scope: {
        mAttribute: '=', // array object attr
        mScope: "=", // scope controller
        mModule: "@",
        mModel: "@",
      },
      link: function ($scope, $element, $attrs) {
        var html = ``;
        if ($scope.mAttribute && $scope.mAttribute.length > 0) {
          for (let i = 0; i < $scope.mAttribute.length; i++) {
            html += `<div class="row">`;

            for (let j = 0; j < $scope.mAttribute[i].length; j++) {
              let attr = $scope.mAttribute[i][j];

              html += `<div class="col-md-${attr.col}">`;
              html += `<div class="form-group"`;
              if (attr.ngIf) {
                html += ` ng-if="${attr.ngIf}"`;
              }
              if (attr.ngShow) {
                html += ` ng-show="${attr.ngShow}"`;
              }
              if (attr.ngHide) {
                html += ` ng-hide="${attr.ngHide}"`;
              }
              html += `>`;
              if (!attr.title) {
                attr.title = `${$scope.mModule}_${attr.name}`;
              }

              html += `<label class="col-md-12 control-label"> {{'${attr.title}' | translate}}`;
              if (attr.required) {
                html += ` <span class="required">*</span>`;
              }
              html += `</label>`;
              html += `<div class="col-md-12">`;

              if (attr.type == 'text') {
                if (!attr.model) {
                  attr.model = `${$scope.mModel}.${attr.name}`;
                }
                html += `<input type="text" class="form-control" ng-model="${attr.model}" name="${attr.name}"`;

                if (attr.ngDisabled) {
                  html += ` ng-disabled="${attr.ngDisabled}"`;
                }
                if (attr.required) {
                  html += ` required`;
                }
                if (attr.valid) {
                  html += ` ${attr.valid}`;
                }
                if (attr.event) {
                  html += ` ${attr.event}`;
                }
                if (attr.id) {
                  html += ` id="${attr.id}"`;
                }
                if (attr.class) {
                  html += ` class="${attr.class}"`;
                }
                html += `/>`;
              }

              else if (attr.type == 'number-integer') {
                if (!attr.model) {
                  attr.model = `${$scope.mModel}.${attr.name}`;
                }
                html += `<input type="number" class="form-control my-number-integer" ng-model="${attr.model}" name="${attr.name}"`;

                if (attr.ngDisabled) {
                  html += ` ng-disabled="${attr.ngDisabled}"`;
                }
                if (attr.required) {
                  html += ` required`;
                }
                if (attr.valid) {
                  html += ` ${attr.valid}`;
                }
                if (attr.event) {
                  html += ` ${attr.event}`;
                }
                if (attr.id) {
                  html += ` id="${attr.id}"`;
                }
                if (attr.class) {
                  html += ` class="${attr.class}"`;
                }
                html += `/>`;
              }

              else if (attr.type == 'number-float') {
                if (!attr.model) {
                  attr.model = `${$scope.mModel}.${attr.name}`;
                }
                html += `<input type="number" class="form-control my-number-float" ng-model="${attr.model}" name="${attr.name}"`;

                if (attr.ngDisabled) {
                  html += ` ng-disabled="${attr.ngDisabled}"`;
                }
                if (attr.required) {
                  html += ` required`;
                }
                if (attr.valid) {
                  html += ` ${attr.valid}`;
                }
                if (attr.event) {
                  html += ` ${attr.event}`;
                }
                if (attr.id) {
                  html += ` id="${attr.id}"`;
                }
                if (attr.class) {
                  html += ` class="${attr.class}"`;
                }
                html += `/>`;
              }

              else if (attr.type == 'textarea') {
                if (!attr.model) {
                  attr.model = `${$scope.mModel}.${attr.name}`;
                }
                html += `<textarea type="text" class="form-control" ng-model="${attr.model}" name="${attr.name}"`;

                if (attr.ngDisabled) {
                  html += ` ng-disabled="${attr.ngDisabled}"`;
                }
                if (attr.required) {
                  html += ` required`;
                }
                if (attr.valid) {
                  html += ` ${attr.valid}`;
                }
                if (attr.event) {
                  html += ` ${attr.event}`;
                }
                if (attr.id) {
                  html += ` id="${attr.id}"`;
                }
                if (attr.class) {
                  html += ` class="${attr.class}"`;
                }
                html += `>`;
                html += `</textarea>`;
              }

              else if (attr.type == 'checkbox') {
                html += `<label class="mt-checkbox mt-checkbox-outline">`;
                if (!attr.model) {
                  attr.model = `${$scope.mModel}.${attr.name}`;
                }
                html += `<input type="checkbox" class="form-control" value="quyet" ng-model="${attr.model}" name="${attr.name}"`;

                if (attr.ngDisabled) {
                  html += ` ng-disabled="${attr.ngDisabled}"`;
                }
                if (attr.required) {
                  html += ` required`;
                }
                if (attr.valid) {
                  html += ` ${attr.valid}`;
                }
                if (attr.event) {
                  html += ` ${attr.event}`;
                }
                if (attr.id) {
                  html += ` id="${attr.id}"`;
                }
                if (attr.class) {
                  html += ` class="${attr.class}"`;
                }
                html += `/>`;
                html += `<span></span>`;
                html += `</label>`;
              }

              else if (attr.type == 'checkbox-list') {
                if(attr.inline){
                  html += `<div class="mt-checkbox-inline">`;
                }
                else{
                  html += `<div class="mt-checkbox-list">`;
                }
                if (attr.option && attr.option.length > 0) {
                  for (let j = 0; j < attr.option.length; j++) {
                    html += `<label class="mt-checkbox mt-checkbox-outline"> ${attr.option[j].title}`;
                    // if (!attr.model) {
                    //   attr.model = `${$scope.mModel}.${attr.name}`;
                    // }
                    html += `<input type="checkbox" class="form-control" ng-model="${$scope.mModel}.${attr.option[j].model}" name="${attr.option[j].model}"`;

                    if (attr.ngDisabled) {
                      html += ` ng-disabled="${attr.ngDisabled}"`;
                    }
                    if (attr.required) {
                      html += ` required`;
                    }
                    if (attr.valid) {
                      html += ` ${attr.valid}`;
                    }
                    if (attr.event) {
                      html += ` ${attr.event}`;
                    }
                    if (attr.id) {
                      html += ` id="${attr.id}"`;
                    }
                    if (attr.class) {
                      html += ` class="${attr.class}"`;
                    }
                    html += `/>`;
                    html += `<span></span>`;
                    html += `</label>`;
                  }
                }
                html += `</div>`;
              }

              else if (attr.type == 'radio') {
                if(attr.inline){
                  html += `<div class="mt-radio-inline">`;
                }
                else{
                  html += `<div class="mt-radio-list">`;
                }
                if (attr.option && attr.option.length > 0) {
                  for (let j = 0; j < attr.option.length; j++) {
                    html += `<label class="mt-radio mt-radio-outline">`;
                    if (!attr.model) {
                      attr.model = `${$scope.mModel}.${attr.name}`;
                    }
                    html += `<input type="radio" class="form-control" value="${attr.option[j].value}" ng-model="${attr.model}" name="${attr.name}"`;

                    if (attr.ngDisabled) {
                      html += ` ng-disabled="${attr.ngDisabled}"`;
                    }
                    if (attr.required) {
                      html += ` required`;
                    }
                    if (attr.valid) {
                      html += ` ${attr.valid}`;
                    }
                    if (attr.event) {
                      html += ` ${attr.event}`;
                    }
                    if (attr.id) {
                      html += ` id="${attr.id}"`;
                    }
                    if (attr.class) {
                      html += ` class="${attr.class}"`;
                    }
                    html += `/> ${attr.option[j].title}`;
                    html += `<span></span>`;
                    html += `</label>`;
                  }
                }
                html += `</div>`;
              }

              else if (attr.type == 'date') {
                if (!attr.model) {
                  attr.model = `${$scope.mModel}.${attr.name}`;
                }
                html += `<my-date ng-model="${attr.model}" name="${attr.name}" checkDate`;

                if (attr.ngDisabled) {
                  html += ` ng-disabled="${attr.ngDisabled}"`;
                }
                if (attr.required) {
                  html += ` required`;
                }
                if (attr.valid) {
                  html += ` ${attr.valid}`;
                }
                if (attr.event) {
                  html += ` ${attr.event}`;
                }
                if (attr.id) {
                  html += ` id="${attr.id}"`;
                }
                if (attr.class) {
                  html += ` class="${attr.class}"`;
                }
                html += `>`;
                html += `</my-date>`;
              }

              else if (attr.type == 'datetime') {

                if (!attr.model) {
                  attr.model = `${$scope.mModel}.${attr.name}`;
                }
                html += `<my-datetime ng-model="${attr.model}" name="${attr.name}" checkDateTime`;

                if (attr.ngDisabled) {
                  html += ` ng-disabled="${attr.ngDisabled}"`;
                }
                if (attr.required) {
                  html += ` required`;
                }
                if (attr.valid) {
                  html += ` ${attr.valid}`;
                }
                if (attr.event) {
                  html += ` ${attr.event}`;
                }
                if (attr.id) {
                  html += ` id="${attr.id}"`;
                }
                if (attr.class) {
                  html += ` class="${attr.class}"`;
                }
                html += `>`;
                html += `</my-datetime>`;
              }

              else if (attr.type == 'select') {
                if (!attr.model) {
                  attr.model = `${$scope.mModel}.${attr.name}`;
                }
                html += `<select my-select class="form-control" ng-model="${attr.model}" name="${attr.name}"`;

                if (attr.ngDisabled) {
                  html += ` ng-disabled="${attr.ngDisabled}"`;
                }
                if (attr.required) {
                  html += ` required-select2`;
                }
                if (attr.mOption) {
                  html += ` m-option="${attr.mOption}"`;
                }
                if (attr.mKeytotext) {
                  html += ` m-keytotext="${attr.mKeytotext}"`;
                }
                if (attr.mKeytoid) {
                  html += ` m-keytoid="${attr.mKeytoid}"`;
                }
                if (attr.mClear) {
                  html += ` m-clear`;
                }
                if (attr.mSearch) {
                  html += ` m-search`;
                }
                if (attr.mMultiple) {
                  html += ` m-multiple`;
                }
                if (attr.valid) {
                  html += ` ${attr.valid}`;
                }
                if (attr.event) {
                  html += ` ${attr.event}`;
                }
                if (attr.id) {
                  html += ` id="${attr.id}"`;
                }
                if (attr.class) {
                  html += ` class="${attr.class}"`;
                }
                html += `>`;
                html += `</select>`;
              }

              else if (attr.type == 'ckeditor') {
                if (!attr.id) {
                  attr.id = `${$scope.mModule}-${attr.name}`;
                }
                if (!attr.model) {
                  attr.model = `${$scope.mModel}.${attr.name}`;
                }
                html += `<textarea type="text" my-ckeditor id="${attr.id}" ng-model="${attr.model}" name="${attr.name}"`;

                if (attr.ngDisabled) {
                  html += ` ng-disabled="${attr.ngDisabled}"`;
                }
                if (attr.required) {
                  html += ` required-ckeditor`;
                }
                if (attr.valid) {
                  html += ` ${attr.valid}`;
                }
                if (attr.event) {
                  html += ` ${attr.event}`;
                }
                if (attr.class) {
                  html += ` class="${attr.class}"`;
                }
                html += `>`;
                html += `</textarea>`;
              }

              else if (attr.type == 'summernote') {
                if (!attr.model) {
                  attr.model = `${$scope.mModel}.${attr.name}`;
                }
                html += `<textarea type="text" my-summernote ng-model="${attr.model}" name="${attr.name}"`;

                if (attr.ngDisabled) {
                  html += ` ng-disabled="${attr.ngDisabled}"`;
                }
                if (attr.required) {
                  html += ` required-summernote`;
                }
                if (attr.valid) {
                  html += ` ${attr.valid}`;
                }
                if (attr.event) {
                  html += ` ${attr.event}`;
                }
                if (attr.id) {
                  html += ` id="${attr.id}"`;
                }
                if (attr.class) {
                  html += ` class="${attr.class}"`;
                }
                html += `>`;
                html += `</textarea>`;
              }

              html += `</div></div></div>`;
            }

            html += `</div>`;
          }
        }

        $element.append($compile(html)($scope.mScope));



      }
    }
  });

})();
