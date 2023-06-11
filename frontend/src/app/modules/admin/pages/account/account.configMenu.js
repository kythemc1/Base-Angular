myApp.configMenu.push({
    title: myApp.configLanguage.language.Account,
    index: 1,
    showInMenuIsRoles: ["*"],
    accessIsRoles: ["*"],
    updateIsRoles: ["*"],
    iconClass: "fa fa-user",
    state: null,
    activeState: null,
    childItems: [
      {
        title: myApp.configLanguage.language.c_list + " " + myApp.configLanguage.language.account,
        showInMenuIsRoles: ["*"],
        accessIsRoles: ["*"],
        updateIsRoles: ["*"],
        iconClass: null,
        state: "admin.account.list",
        activeState: [
          "admin.account.create", "admin.account.update", "admin.account.detail",
        ],
        childItems: null
      },
      {
        title: myApp.configLanguage.language.c_create + " " + myApp.configLanguage.language.account,
        showInMenuIsRoles: [],
        accessIsRoles: ["*"],
        updateIsRoles: ["*"],
        iconClass: null,
        state: "admin.account.create",
        activeState: null,
        childItems: null
      },
      {
        title: myApp.configLanguage.language.c_update + " " + myApp.configLanguage.language.account,
        showInMenuIsRoles: [],
        accessIsRoles: ["*"],
        updateIsRoles: ["*"],
        iconClass: null,
        state: "admin.account.update",
        activeState: null,
        childItems: null
      },
      {
        title: myApp.configLanguage.language.c_detail + " " + myApp.configLanguage.language.account,
        showInMenuIsRoles: [],
        accessIsRoles: ["*"],
        updateIsRoles: ["*"],
        iconClass: null,
        state: "admin.account.detail",
        activeState: null,
        childItems: null
      }
    ]
  });