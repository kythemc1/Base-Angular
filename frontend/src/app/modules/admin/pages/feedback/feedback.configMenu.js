
//Menu 3 cấp childItems
/* {
  title: language."Danh mục mẫu",
  index: numbber,
  showInMenuIsRoles: ["Contributor", "Sale", "CustomerCare", "User"], ["*"] or array[role] or [];
  accessIsRoles: ["*"],  ["*"] or array[role] or [];
  updateIsRoles: ["*"],  ["*"] or array[role] or [];
  iconClass: "fa fa-list",
  state: null, Menu cha thì state = null;
  activeState: null,
  childItems: [{ array[object] or null
    title: language.c_list + "Danh mục mẫu",
    showInMenuIsRoles: ["*"],
    accessIsRoles: ["*"],
    updateIsRoles: ["*"],
    iconClass: null,
    state: "admin.demo.list",
    activeState: [ array[string] or null; để active menu khi truy cập vào các view con, chỉ cần thêm thuộc tính này ở state đặt tại menu nếu có trang con
      "admin.demo.create", "admin.demo.edit", "admin.demo.detail",
    ],
    childItems: null array[object] or null
  }]
}, */

myApp.configMenu.push({
    title: myApp.configLanguage.language.Feedback,
    index: 4,
    showInMenuIsRoles: ["*"],
    accessIsRoles: ["*"],
    updateIsRoles: ["*"],
    iconClass: "fa fa-comments",
    state: null,
    activeState: null,
    childItems: [
        {
            title: myApp.configLanguage.language.c_list + " " + myApp.configLanguage.language.feedback,
            showInMenuIsRoles: ["*"],
            accessIsRoles: ["*"],
            updateIsRoles: ["*"],
            iconClass: null,
            state: "admin.feedback.list",
            activeState: [
                "admin.feedback.create", "admin.feedback.update", "admin.feedback.detail",
            ],
            childItems: null
        },
        {
            title: myApp.configLanguage.language.c_create + " " + myApp.configLanguage.language.feedback,
            showInMenuIsRoles: [],
            accessIsRoles: ["*"],
            updateIsRoles: ["*"],
            iconClass: null,
            state: "admin.feedback.create",
            activeState: null,
            childItems: null
        },
        {
            title: myApp.configLanguage.language.c_update + " " + myApp.configLanguage.language.feedback,
            showInMenuIsRoles: [],
            accessIsRoles: ["*"],
            updateIsRoles: ["*"],
            iconClass: null,
            state: "admin.feedback.update",
            activeState: null,
            childItems: null
        },
        {
            title: myApp.configLanguage.language.c_detail + " " + myApp.configLanguage.language.feedback,
            showInMenuIsRoles: [],
            accessIsRoles: ["*"],
            updateIsRoles: ["*"],
            iconClass: null,
            state: "admin.feedback.detail",
            activeState: null,
            childItems: null
        }
    ]
});