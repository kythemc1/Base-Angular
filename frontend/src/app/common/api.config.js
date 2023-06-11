MyApp.service('ApiService', ['$rootScope', 'APP_CONFIG',
  function ($rootScope, APP_CONFIG) {

    let a_language = APP_CONFIG.languageConfig.language
    var _this = this;
    function checkSuccess(resolve, res, objData) {
      if (objData.message && objData.message.success == "hidden") {
      }
      else if (objData.message && objData.message.success) {
        toastr.success(objData.message.success);
      } else {
        if (objData.type == "findById") {

        }
        if (objData.type == "list") {

        }
        if (objData.type == "create") {
          toastr.success(a_language.c_addSuccess);
        }
        if (objData.type == "partialUpdate") {
          toastr.success(a_language.c_updateSuccess);
        }
        if (objData.type == "delete") {
          toastr.success(a_language.c_deleteSuccess);
        }
        if (objData.type == "batchDelete") {
          if (res.info.meta && res.info.meta.successIds && res.info.meta.successIds.length > 0) {
            toastr.success(a_language.c_delete + " " + res.info.meta.successIds.length + " " + a_language.c_record + " " + a_language.c_success);
          }
          if (res.info.meta && res.info.meta.failureIds && res.info.meta.failureIds.length > 0) {
            toastr.error(a_language.c_delete + " " + res.info.meta.failureIds.length + " " + a_language.c_record + " " + a_language.c_success);
          }
        }
      }
      resolve(res);
    };

    function checkError(err, objData) {
      if (objData.message && objData.message.error == "hidden") {
      }
      else if (objData.message && objData.message.error) {
        toastr.error(objData.message.error);
      } else {
        if (objData.type == "findById") {

        }
        if (objData.type == "list") {

        }
        if (objData.type == "create") {
          toastr.error(a_language.c_addError);
        }
        if (objData.type == "partialUpdate") {
          toastr.error(a_language.c_updateError);
        }
        if (objData.type == "delete") {
          toastr.error(a_language.c_deleteError);
        }
        if (objData.type == "batchDelete") {
          toastr.error(a_language.c_deleteError);
        }
      }
      reject(err);
    };

    _this.send = (objData) => {

      // let objData = {
      //   module: "",  //required string
      //   type: "", //required string
      // message: {
      //   success: "", //string | null | comment
      //   error: "",  //string | null | comment
      // },
      //   value: {}  //string | null | comment
      // }

      return new Promise(function (resolve, reject) {
        mushroom[objData.module][objData.type](objData.value)
          .done(function (response, info) {
            checkSuccess(resolve, { data: response, info: info }, objData);
          })
          .fail(function (error) {
            checkError(reject, error, objData);
          });
      })
    };

  }
]);
