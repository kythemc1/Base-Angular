myApp.configMenu.push({
    title: myApp.configLanguage.language.Faq,
    index: 3,
    showInMenuIsRoles: ["*"],
    accessIsRoles: ["*"],
    updateIsRoles: ["*"],
    iconClass: "fa fa-question-circle",
    state: null,
    activeState: null,
    childItems: [
      {
        title: myApp.configLanguage.language.c_list + " " + myApp.configLanguage.language.faq,
        showInMenuIsRoles: ["*"],
        accessIsRoles: ["*"],
        updateIsRoles: ["*"],
        iconClass: null,
        state: "admin.faq.list",
        activeState: [
          "admin.faq.create", "admin.faq.update", "admin.faq.detail",
        ],
        childItems: null
      },
      {
        title: myApp.configLanguage.language.c_create + " " + myApp.configLanguage.language.faq,
        showInMenuIsRoles: [],
        accessIsRoles: ["*"],
        updateIsRoles: ["*"],
        iconClass: null,
        state: "admin.faq.create",
        activeState: null,
        childItems: null
      },
      {
        title: myApp.configLanguage.language.c_update + " " + myApp.configLanguage.language.faq,
        showInMenuIsRoles: [],
        accessIsRoles: ["*"],
        updateIsRoles: ["*"],
        iconClass: null,
        state: "admin.faq.update",
        activeState: null,
        childItems: null
      },
      {
        title: myApp.configLanguage.language.c_detail + " " + myApp.configLanguage.language.faq,
        showInMenuIsRoles: [],
        accessIsRoles: ["*"],
        updateIsRoles: ["*"],
        iconClass: null,
        state: "admin.faq.detail",
        activeState: null,
        childItems: null
      }
    ]
  });