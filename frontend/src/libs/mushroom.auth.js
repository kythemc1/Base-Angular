(function () {
  var authConnections = {};
  var tokenPool = {};

  mushroom.$auth = {};

  // số phút lưu trữ token nếu inactive
  mushroom.$auth.expiredTime = 30;

  function saveToken(rootApiUrl, token, permanent) {

    deleteToken(rootApiUrl);

    localStorage.setItem("mushroom.tokens[" + rootApiUrl + "]", token);

    if (!permanent)
      localStorage.setItem("mushroom.tokens[" + rootApiUrl + "].expried", new Date().getTime() + mushroom.$auth.expiredTime * 60000);
  }

  function deleteToken(rootApiUrl) {
    localStorage.removeItem("mushroom.tokens[" + rootApiUrl + "]");
    localStorage.removeItem("mushroom.tokens[" + rootApiUrl + "].expried");
  }

  function loadTokens() {
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key && key.indexOf("mushroom.tokens[") === 0 && key.charAt(key.length - 1) === "]") {
        var expried = localStorage.getItem(key + ".expried");
        if (expried) {
          expried = parseInt(expried);
          if (isNaN(expried) || expried < new Date().getTime()) {
            continue;
          }
        }
        var apiUrl = key.substring("mushroom.tokens[".length, key.length - 1);
        tokenPool[apiUrl] = localStorage.getItem(key);
        authConnections[apiUrl] = {};
      }
    }
  }
  try {
    loadTokens();
  } catch (e) {}


  function generateObsolatedError(fnName, newFnName) {
    return function () {
      var msg = "Method '" + fnName + "' was no longer supported.";
      if (newFnName)
        msg += " Use '" + newFnName + "' instead.";
      throw new Error(msg);
    };
  }

  mushroom.$login = generateObsolatedError("mushroom.$login", "mushroom.$auth.login");
  mushroom.$logout = generateObsolatedError("mushroom.$logout", "mushroom.$auth.logout");
  mushroom.$authStatus = generateObsolatedError("mushroom.$authStatus", "mushroom.$auth.status");
  mushroom.$me = generateObsolatedError("mushroom.$me", "mushroom.$auth.me");

  mushroom.$auth.login = function (account, password, remember) {
    var rootApiUrl = mushroom.$using();
    if (!authConnections[rootApiUrl])
      authConnections[rootApiUrl] = {};

    var cr = (mushroom.__createRestFunction({
      name: "$login",
      connection: authConnections[rootApiUrl],
      rootApiUrl: rootApiUrl,
      method: "POST",
      blankBody: false,
      url: rootApiUrl + "auth/login"
    }))({
      account: account,
      password: password
    });
    cr.done(function (response) {
      tokenPool[rootApiUrl] = response.token;
      try {
        saveToken(rootApiUrl, response.token, remember);
      } catch (e) {}
    });
    return cr;
  };
  mushroom.$auth.logout = function (options) {
    if (typeof options === "boolean") {
      options = {
        mode: options ? "invalidAllSession" : "invalidServerSession"
      };
    } else if (typeof options !== "object" || options === null) {
      options = {
        mode: "invalidServerSession"
      };
    }

    if (options.mode !== "invalidClientSession" &&
      options.mode !== "invalidServerSession" &&
      options.mode !== "invalidAllSession") {
      options.mode = "invalidServerSession";
    }

    // mode: invalidClientSession, invalidServerSession, invalidAllSession

    var rootApiUrl = mushroom.$using();

    if (options.mode === "invalidClientSession") {
      delete tokenPool[rootApiUrl];
      deleteToken(rootApiUrl);
      return {
        done: function (callback) {
          if (typeof callback === "function")
            setTimeout(callback, 0);
        },
        fail: function () {},
        always: function (callback) {
          if (typeof callback === "function")
            setTimeout(callback, 0);
        }
      };
    } else {
      if (!authConnections[rootApiUrl])
        authConnections[rootApiUrl] = {};

      var cr = (mushroom.__createRestFunction({
        name: "$logout",
        connection: authConnections[rootApiUrl],
        rootApiUrl: rootApiUrl,
        method: "GET",
        blankBody: false,
        url: rootApiUrl + "auth/logout" + (options.mode === "invalidAllSession" ? "?invalidAllSession=true" : "")
      }))();
      cr.always(function () {
        delete tokenPool[rootApiUrl];
        deleteToken(rootApiUrl);
      });
      return cr;
    }
  };
  mushroom.$auth.status = function () {
    var rootApiUrl = mushroom.$using();
    if (!authConnections[rootApiUrl])
      authConnections[rootApiUrl] = {};

    return (mushroom.__createRestFunction({
      name: "$status",
      connection: authConnections[rootApiUrl],
      rootApiUrl: rootApiUrl,
      method: "GET",
      blankBody: false,
      url: rootApiUrl + "auth/status"
    }))();
  };
  mushroom.$auth.me = function () {
    var rootApiUrl = mushroom.$using();
    if (!authConnections[rootApiUrl])
      authConnections[rootApiUrl] = {};

    return (mushroom.__createRestFunction({
      name: "$me",
      connection: authConnections[rootApiUrl],
      rootApiUrl: rootApiUrl,
      method: "GET",
      blankBody: false,
      url: rootApiUrl + "auth/me"
    }))();
  };

  mushroom.$auth.register = function (account, password) {
    var rootApiUrl = mushroom.$using();
    if (!authConnections[rootApiUrl])
      authConnections[rootApiUrl] = {};

    return (mushroom.__createRestFunction({
      name: "$register",
      connection: authConnections[rootApiUrl],
      rootApiUrl: rootApiUrl,
      method: "POST",
      blankBody: false,
      url: rootApiUrl + "auth/register"
    }))({
      account: account,
      password: password
    });
  };

  mushroom.$auth.activate = function (account, code) {
    var rootApiUrl = mushroom.$using();
    if (!authConnections[rootApiUrl])
      authConnections[rootApiUrl] = {};

    return (mushroom.__createRestFunction({
      name: "$activate",
      connection: authConnections[rootApiUrl],
      rootApiUrl: rootApiUrl,
      method: "POST",
      blankBody: false,
      url: rootApiUrl + "auth/activate"
    }))({
      account: account,
      code: code
    });
  };

  mushroom.$auth.recoverPassword = function (account) {
    var rootApiUrl = mushroom.$using();
    if (!authConnections[rootApiUrl])
      authConnections[rootApiUrl] = {};

    return (mushroom.__createRestFunction({
      name: "$recoverPassword",
      connection: authConnections[rootApiUrl],
      rootApiUrl: rootApiUrl,
      method: "POST",
      blankBody: false,
      url: rootApiUrl + "auth/recover-password"
    }))({
      account: account
    });
  };

  mushroom.$auth.changePassword = function (account, oldPassword, newPassword) {
    var rootApiUrl = mushroom.$using();
    if (!authConnections[rootApiUrl])
      authConnections[rootApiUrl] = {};

    return (mushroom.__createRestFunction({
      name: "$changePassword",
      connection: authConnections[rootApiUrl],
      rootApiUrl: rootApiUrl,
      method: "POST",
      blankBody: false,
      url: rootApiUrl + "auth/reset-password"
    }))({
      account: account,
      oldPassword: oldPassword,
      newPassword: newPassword
    });
  };

  mushroom.$auth.resetPassword = function (account, code, newPassword) {
    var rootApiUrl = mushroom.$using();
    if (!authConnections[rootApiUrl])
      authConnections[rootApiUrl] = {};

    return (mushroom.__createRestFunction({
      name: "$resetPassword",
      connection: authConnections[rootApiUrl],
      rootApiUrl: rootApiUrl,
      method: "POST",
      blankBody: false,
      url: rootApiUrl + "auth/reset-password"
    }))({
      account: account,
      code: code,
      newPassword: newPassword
    });
  };

  mushroom._on("beforeSend",
    function (args) {
      var rootApiUrl = mushroom.$using();
      if (tokenPool[rootApiUrl]) {
        var expried = localStorage.getItem("mushroom.tokens[" + rootApiUrl + "].expried");
        if (expried) {
          expried = parseInt(expried);
          if (isNaN(expried) || expried < new Date().getTime()) {
            deleteToken(rootApiUrl);
            return;
          }
          localStorage.setItem("mushroom.tokens[" + rootApiUrl + "].expried", new Date().getTime() + mushroom.$auth.expiredTime * 60000);
        }

        args.headers.Token = tokenPool[rootApiUrl];
      }
    });
})();
