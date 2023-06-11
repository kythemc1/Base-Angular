deferredBootstrapper.bootstrap({
  element: document,
  module: "MyApp",
  injectorModules: "Auth",
  resolve: {
    APP_CONFIG: [
      "$http",
      "AuthService",
      function ($http, AuthService) {
        App.blockUI();        

        let listMenuItem = [];
        if(myApp.configMenu.length > 0){
          listMenuItem = myApp.configMenu.sort(function (a, b) { return a.index - b.index });
        }

        var createMenu = function (roles) {
          for (let i = 0; i < roles.length; i++) {
            for (let j = 0; j < listMenuItem.length; j++) {
              let menuItem = listMenuItem[j];
              if (!menuItem.visible && menuItem.showInMenuIsRoles.indexOf(roles[i]) != -1 || menuItem.showInMenuIsRoles.indexOf("*") == 0) {
                menuItem.visible = true;
              }
              if (!menuItem.access && menuItem.accessIsRoles.indexOf(roles[i]) != -1 || menuItem.accessIsRoles.indexOf("*") == 0) {
                menuItem.access = true;
              }
              if (!menuItem.update && menuItem.updateIsRoles.indexOf(roles[i]) != -1 || menuItem.updateIsRoles.indexOf("*") == 0) {
                menuItem.update = true;
              }

              if (menuItem.childItems) {
                for (let k = 0; k < menuItem.childItems.length; k++) {
                  let childItem = menuItem.childItems[k];
                  if (!childItem.visible && childItem.showInMenuIsRoles.indexOf(roles[i]) != -1 || childItem.showInMenuIsRoles.indexOf("*") == 0) {
                    childItem.visible = true;
                  }
                  if (!childItem.access && childItem.accessIsRoles.indexOf(roles[i]) != -1 || childItem.accessIsRoles.indexOf("*") == 0) {
                    childItem.access = true;
                  }
                  if (!childItem.update && childItem.updateIsRoles.indexOf(roles[i]) != -1 || childItem.updateIsRoles.indexOf("*") == 0) {
                    childItem.update = true;
                  }

                  if (childItem.childItems) {
                    for (let h = 0; h < childItem.childItems.length; h++) {
                      let childItem2 = childItem.childItems[h];
                      if (!childItem2.visible && childItem2.showInMenuIsRoles.indexOf(roles[i]) != -1 || childItem2.showInMenuIsRoles.indexOf("*") == 0) {
                        childItem2.visible = true;
                      }
                      if (!childItem2.access && childItem2.accessIsRoles.indexOf(roles[i]) != -1 || childItem2.accessIsRoles.indexOf("*") == 0) {
                        childItem2.access = true;
                      }
                      if (!childItem2.update && childItem2.updateIsRoles.indexOf(roles[i]) != -1 || childItem2.updateIsRoles.indexOf("*") == 0) {
                        childItem2.update = true;
                      }
                    }
                  }
                }
              }

            }
          }
          return listMenuItem;
        };

        return new Promise(function (resolve, reject) {
          mushroom._on("beforeSend", function (arg) {
            arg.headers = arg.headers || {};
            arg.headers["X-Client"] = "Sitmo Web";
            arg.headers["X-Client-Platform"] = "Mushroom";
            arg.headers["X-Client-Version"] = "0.1";
          });

          AuthService.me().then(function (res) {
            var newMenu = createMenu(res.roles);
            App.unblockUI();
            resolve({
              userInfo: res,
              menuConfig: newMenu,
              languageConfig: myApp.configLanguage
            });
          }, function (err) {
            App.unblockUI();
            resolve({
              userInfo: null,
              menuConfig: null,
              languageConfig: myApp.configLanguage
            });
          });
        });

      }
    ]
  }
});
