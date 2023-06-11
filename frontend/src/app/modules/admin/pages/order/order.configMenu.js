myApp.configMenu.push({
    title: myApp.configLanguage.language.Order,
    index: 2,
    showInMenuIsRoles: ["*"],
    accessIsRoles: ["*"],
    updateIsRoles: ["*"],
    iconClass: "fa fa-shopping-cart",
    state: null,
    activeState: null,
    childItems: [
        {
            title: myApp.configLanguage.language.c_list + " " + myApp.configLanguage.language.order,
            showInMenuIsRoles: ["*"],
            accessIsRoles: ["*"],
            updateIsRoles: ["*"],
            iconClass: null,
            state: "admin.order.list",
            activeState: [
                "admin.order.create", "admin.order.update", "admin.order.detail",
            ],
            childItems: null
        },
        {
            title: myApp.configLanguage.language.c_create + " " + myApp.configLanguage.language.order,
            showInMenuIsRoles: [],
            accessIsRoles: ["*"],
            updateIsRoles: [],
            iconClass: null,
            state: "admin.order.create",
            activeState: null,
            childItems: null
        },
        {
            title: myApp.configLanguage.language.c_update + " " + myApp.configLanguage.language.order,
            showInMenuIsRoles: [],
            accessIsRoles: ["*"],
            updateIsRoles: ["*"],
            iconClass: null,
            state: "admin.order.update",
            activeState: null,
            childItems: null
        },
        {
            title: myApp.configLanguage.language.c_detail + " " + myApp.configLanguage.language.order,
            showInMenuIsRoles: [],
            accessIsRoles: ["*"],
            updateIsRoles: ["*"],
            iconClass: null,
            state: "admin.order.detail",
            activeState: null,
            childItems: null
        }
    ]
});