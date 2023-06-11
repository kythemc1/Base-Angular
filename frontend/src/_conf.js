
var MyConfig = {};

//Nhận 1 trong các giá trị sau: test | production
var environment = "test";

if (environment == "test") {

  MyConfig.language = "vi";

  //setting origin/path
  MyConfig.basePath = "";

  window.location_basePath = window.location.origin + MyConfig.basePath;

  MyConfig.host = "http://sitmo-api.test2.siten.vn/api/web/v1/";

} else if (environment == "production") {

  MyConfig.language = "vi";

  //setting origin/path
  MyConfig.basePath = "";

  window.location_basePath = window.location.origin + MyConfig.basePath;
  
  MyConfig.host = "http://sitmo-api.test2.siten.vn/api/web/v1/";
}

mushroom.$using(MyConfig.host);