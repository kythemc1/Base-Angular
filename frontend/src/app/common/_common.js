toastr.options = {
  "closeButton": true,
  "debug": false,
  "positionClass": "toast-top-full-width",
  "onclick": null,
  "opacity": 1,
  "showDuration": "1000",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};

//js css loading
NProgress.configure({
  trickleSpeed: 1000,
  showSpinner: false,
  minimum: 0.2
});

var objLanguage = {
  translations_vi: {},
  translations_en: {},
  language: {}
};

App_Dictionary.forEach(item => {
  objLanguage.translations_vi[item[0]] = item[1];
  objLanguage.translations_en[item[0]] = item[2];
});
if (MyConfig.language == "vi") {
  objLanguage.language = objLanguage.translations_vi;
}
if (MyConfig.language == "en") {
  objLanguage.language = objLanguage.translations_en;
}


var myApp = {
  configMenu: [],
  configLanguage: objLanguage,

  validateForm: function (element, config) {
    var defaultConfig = {
      errorElement: 'div', //default input error message container
      errorClass: 'help-block help-block-error', // default input error message class
      focusInvalid: true, // do not focus the last invalid input
      //ignore: ".ignore", // validate all fields including form hidden input
      ignore: ":input:hidden.form-control,textarea:hidden.form-control",
      errorPlacement: function (error, element) {
        if (element.closest(".form-group").find(".input-group").length > 0) {
          error.insertAfter(element.closest(".form-group").find(".input-group"));
        } else if (element.is(':checkbox')) {
          // error.insertAfter(element.closest(".form-group").find(".mt-checkbox"));
        } else if (element.is(':radio')) {
          // error.insertAfter(element.closest(".md-radio-list, .md-radio-inline, .radio-list,.radio-inline"));
        } else if (element.is('select')) {
          error.insertAfter(element.closest(".form-group").find(".select2-container--bootstrap"));
        } else if (element.is('textarea')) {
          if ($(element).attr("summernote") != undefined) {
            error.insertAfter(element.closest(".form-group").find(".note-editor"));
          } else if ($(element).attr("ckeditor") != undefined) {
            error.insertAfter(element.closest(".form-group").find(".cke"));
          } else {
            error.insertAfter(element);
          }
        } else if (element.is(':file')) {
          error.insertAfter(element.closest(".fileinput"));
        } else {
          error.insertAfter(element); // for other inputs, just perform default behavior
        }

      },
      highlight: function (element, errorClass, validClass) {
        $(element)
          .closest('.form-group').addClass('has-error'); // set error class to the control group
      },
      unhighlight: function (element, errorClass, validClass) { // revert the change done by hightlight
        $(element).closest('.form-group').removeClass('has-error'); // set error class to the control group
        $(element).closest('.form-group').find('.help-block.help-block-error').remove();
      },
      submitHandler: function (form) { },
      debug: true

    };
    return $(element).validate($.extend({}, defaultConfig, config));
  },

  //truyền id modal để xóa validation form
  resetFormModal: function (idForm) {
    setTimeout(function () {
      $(idForm).validate().resetForm();
    }, 300)
  },

  convertTimestampToDate: timestamp => {
    if (!timestamp) return null;
    var d = new Date(Number(timestamp));
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  },

  showTooltip: function (value, lengthSlice, isEnableHtml) {
    if (value) {
      if (isEnableHtml) {
        if (value.indexOf('&lt') == -1 || value.indexOf('&gt') == -1) {
          value = $(`<div>${value}</div>`).text();
        }
      } else {
        value = value.replace(/</g, '&lt');
      }
      var length = 100;
      if (lengthSlice) {
        length = lengthSlice;
      }
      if (value.indexOf("</p><p>") != -1) {
        length = value.indexOf("</p><p>");
      }
      if (value.length > length && value.length > 800) {
        var dataTrimmed = value.slice(0, value.slice(0, length).lastIndexOf(" "));
        return `<div class="tooltipster">${dataTrimmed}...
                <div class="tooltip_content">${value.slice(0, 800)}...</div></div>`;
      } else if (value.length > length && value.length < 800) {
        var dataTrimmed = value.slice(0, value.slice(0, length).lastIndexOf(" "));
        return `<div class="tooltipster">${dataTrimmed}...
                <div class="tooltip_content">${value.slice(0, 800)}</div></div>`;
      } else if (value.length <= length) {
        return `<div>${value}</div>`;
      } else {
        return ``;
      }
    } else {
      return ``;
    }
  },

  trimAllHtml: function (value) {
    value = value.replace(/<(?:.|\n)*?>/gm, '');
    return value;
  }

}

///Tính toán lại thời gian giữa client và server
window.serverMoment = function () {
  //thời gian đã được tính toán
  if (window.differentTime) {
    var date = moment().add(window.differentTime);
  }
  //thời gian chưa tính toán
  else {
    var date = moment();
  }
  return date;
};
