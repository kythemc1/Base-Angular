swal.show = function (type, title, text, callback) {
  return new Promise(function (resolve, reject) {
    if (type == "success") {
      swal({
        title: title,
        text: text,
        type: "success",
        showCancelButton: false,
        confirmButtonText: "OK",
        confirmButtonClass: "green-meadow",
        closeOnConfirm: true
      }, function () {
        if (callback) {
          callback();
        }
        else {
          resolve();
        }
      });
    }
    else if (type == "info") {
      swal({
        title: title,
        text: text,
        type: "info",
        showCancelButton: false,
        confirmButtonClass: "green-meadow",
        confirmButtonText: "OK",
        closeOnConfirm: true
      }, function () {
        if (callback) {
          callback();
        }
        else {
          resolve();
        }
      });
    }
    else if (type == "confirm") {
      swal({
        title: title,
        text: text,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "green-meadow",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        closeOnConfirm: true,
        showLoaderOnConfirm: false
      },
      function (isConfirm) {
        if(isConfirm){
          if (callback) {
            callback(true);
          }
          else{
            resolve();
          }
        }        
        else {
          if (callback) {
            callback(false);
          }
          else{
            resolve();
          }
        }
      });
    }
    else if (type == "error") {
      swal({
        title: title,
        text: text,
        type: "error",
        showCancelButton: false,
        confirmButtonText: "OK",
        confirmButtonClass: "green-meadow",
        closeOnConfirm: true
      }, function () {
        if (callback) {
          callback();
        }
        else {
          resolve();
        }
      });
    }
  });
};
