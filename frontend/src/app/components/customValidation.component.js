jQuery.validator.addMethod("required", function (value, element) {
  if (value) {
    //cho select2 chọn nhiều
    if (Array.isArray(value)) {
      value = value.toString();
    }
    return value.trim() == '' ? false : true;
  }
});

jQuery.validator.addMethod("email", function (value, element) {
  return this.optional(element) || /^[a-zA-Z0-9.!$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/g.test($.trim(value)); // check
});

jQuery.validator.addMethod("phone", function (value, element) {
  return this.optional(element) || /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g.test($.trim(value));
});

jQuery.validator.addMethod("link", function (value, element) {
  return this.optional(element) || /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(value);
});

jQuery.validator.addMethod("imageLink", function (value, element) {
  return this.optional(element) || /(https?:)?\/?[^'"<>]+?\.(jpg|jpeg|gif|png)/.test(value);
});

jQuery.validator.addMethod("requiredSelect2", function (value, element, arg) {
  if (value == '' || value == null) {
    return false;
  } else if ($.isArray(value) && value.length == 0) {
    return false
  }
  return true;
});

jQuery.validator.addMethod("sign", function (value, element) {
  return this.optional(element) || /^[^ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]*$/g.test(value); // check
});

jQuery.validator.addMethod("space", function (value, element) {
  return this.optional(element) || /^[^\s]*$/g.test(value);
});

jQuery.validator.addMethod("script", function (value, element) {
  return this.optional(element) || /^[\u00BF-\u1FFF\u2C00-\uD7FF\w\_\s]*$/g.test(value);
});

jQuery.validator.addMethod("az09", function (value, element) {
  return this.optional(element) || /^[0-9a-zA-Z]+$/g.test(value);
});

jQuery.validator.addMethod("textFirst", function (value, element) {
  return this.optional(element) || /^[a-zA-Z].*/g.test(value);
});

jQuery.validator.addMethod("dateTime", function (value, element) {
  return this.optional(element) || /^([1-9]|([012][0-9])|(3[01]))[/]([0]{0,1}[1-9]|1[012])[/]\d\d\d\d [012]{0,1}[0-9]:[0-6][0-9]$/g.test(value);
});

jQuery.validator.addMethod("date", function (value, element) {
  return this.optional(element) || /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/g.test(value);
});

jQuery.validator.addMethod("year", function (value, element) {
  return this.optional(element) || /^\d{4}$/g.test(value);
});

jQuery.validator.addMethod("month", function (value, element) {
  return this.optional(element) || /^\d{2}[/]\d{4}$/g.test(value);
});

jQuery.validator.addMethod("summernote", function (value, element) {
  return checkValueSummernote(value);
});

function checkValueSummernote(value) {
  //thẻ list
  if (value == "<ol><li><br></li></ol>") {
    value = "<ol><li></li></ol>"
  }
  //cắt kí tự cách và enter, tab để check
  while (value.startsWith('<p>&nbsp;')) {
    value = value.replace('<p>&nbsp;', '<p>')
  }
  while (value.startsWith('<p> &nbsp;')) {
    value = value.replace('<p> &nbsp;', '<p>')
  }
  while (value.startsWith('<p></p>')) {
    value = value.replace('<p></p>', '')
  }
  while (value.startsWith('<p><br></p>')) {
    value = value.replace('<p><br></p>', '')
  }
  while (value.startsWith('<div><br></div>')) {
    value = value.replace('<div><br></div>', '')
  }
  while (value.endsWith('<p><br></p>')) {
    value = value.replace(new RegExp('<p><br></p>$'), '')
  }
  while (value.endsWith('&nbsp;</p>')) {
    value = value.replace(new RegExp('&nbsp;</p>$'), '</p>')
  }
  while (value.endsWith('&nbsp; </p>')) {
    value = value.replace(new RegExp('&nbsp; </p>$'), '</p>')
  }
  while (value.startsWith('&nbsp;')) {
    value = value.replace('&nbsp;', '')
  }
  while (value.startsWith(' &nbsp;')) {
    value = value.replace(' &nbsp;', '')
  }
  if (value == "<p></p>" || value == "&nbsp;" || value == " &nbsp;") {
    value = "";
  }
  if (value == "") {
    return false;
  } else {
    return true;
  }
};

jQuery.validator.addMethod("ckeditor", function (value, element) {
  return checkValueCkeditor(value);
});

function checkValueCkeditor(value) {
  if (value == "") {
    return false;
  } else {
    return true;
  }
};

jQuery.validator.addMethod("int", function (value, element) {
  return this.optional(element) || /^[-]?[\d]+$/.test(value);
});

jQuery.validator.addMethod("float", function (value, element) {
  return this.optional(element) || /^[-]?[\d.]+$/.test(value);
});

jQuery.validator.addMethod("tuNgay", function (value, element) {
  let tungay = moment($('my-date[check-tuNgay]').datepicker('getDate')).format("YYYYMMDD");
  let denngay = moment($('datepicker[check-denNgay]').datepicker('getDate')).format("YYYYMMDD");
  if (tungay == "Invalid date" || denngay == "Invalid date") {
    return true;
  }
  if (tungay > denngay) {
    return false;
  }
  else {
    return true;
  }
});

jQuery.validator.addMethod("denNgay", function (value, element) {
  let tungay = moment($('my-date[check-tuNgay]').datepicker('getDate')).format("YYYYMMDD");
  let denngay = moment($('my-date[check-DenNgay]').datepicker('getDate')).format("YYYYMMDD");
  if (tungay == "Invalid date" || denngay == "Invalid date") {
    return true;
  }
  if (tungay > denngay) {
    return false;
  }
  else {
    return true;
  }
});

jQuery.validator.addMethod("upload", function (value, element, arg) {
  return value != arg ? false : true;
});

