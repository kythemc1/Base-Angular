(function () {
  "use strict";

  var CACHE_AGE = 60000; // số mili giây

  var requestPool = [];
  var clientCacheData = {};
  var connectionStatus = "online";
  var debugMode = location.hostname === "localhost";
  var events = {};
  

  function Bridge() {
      this.fireSuccess = function (result, additionalInfo) {
          if (this.onsuccess)
              this.onsuccess(result, additionalInfo);
      };
      this.fireError = function (error) {
          if (this.onerror)
              this.onerror(error);
      };
  }

  function RestfullResult(xRequest, bridge) {

      var cachedResult;
      var cachedAdditionalInfo;
      var cachedError;
      var state = "new";
      var fnSuccessCallbacks = [];
      var fnErrorCallbacks = [];
      var fnCompletedCallbacks = [];

      bridge.onsuccess = function (result, additionalInfo) {
          cachedResult = result;
          cachedAdditionalInfo = additionalInfo;
          state = "done";
          fnSuccessCallbacks.forEach(function (fn) {
              try {
                  fn(cachedResult, cachedAdditionalInfo);
              } catch (e) {
                  console.error("Error when done: %s\nStackTrace: %s", e.message, e.stack);
              }
          });
          fnCompletedCallbacks.forEach(function (fn) {
              try {
                  fn({
                      result: cachedResult,
                      additionalInfo: cachedAdditionalInfo,
                      error: cachedError
                  });
              } catch (e) {
                  console.error("Error when completed: %s\nStackTrace: %s", e.message, e.stack);
              }
          });
      };

      bridge.onerror = function (error) {
          cachedError = error;
          state = "fail";
          fnErrorCallbacks.forEach(function (fn) {
              try {
                  fn(cachedError);
              } catch (e) {
                  console.error("Error when handle fail: %s\nStackTrace: %s", e.message, e.stack);
              }
          });
          fnCompletedCallbacks.forEach(function (fn) {
              try {
                  fn({
                      result: cachedResult,
                      additionalInfo: cachedAdditionalInfo,
                      error: cachedError
                  });
              } catch (e) {
                  console.error("Error when completed: %s\nStackTrace: %s", e.message, e.stack);
              }
          });
      };

      this.done = function (fnSuccessCallback) {
          if ("function" !== typeof fnSuccessCallback)
              return this;

          if (state === "new") {
              fnSuccessCallbacks.push(fnSuccessCallback);
              return this;
          }

          if (state === "done") {
              setTimeout(fnSuccessCallback, 10, cachedResult, cachedAdditionalInfo);
              return this;
          }
          return this;
      };

      this.fail = function (fnErrorCallback) {
          if ("function" !== typeof fnErrorCallback)
              return this;

          if (state === "new") {
              fnErrorCallbacks.push(fnErrorCallback);
              return this;
          }

          if (state === "fail") {
              setTimeout(fnErrorCallback, 1, cachedError);
              return this;
          }
          return this;
      };

      this.always = function (fnCompletedCallback) {
          if ("function" !== typeof fnCompletedCallback)
              return this;

          if (state === "new") {
              fnCompletedCallbacks.push(fnCompletedCallback);
              return this;
          }

          if (state === "done" || state === "fail" || state === "aborted") {
              setTimeout(fnCompletedCallback, 1, cachedResult, cachedError, cachedAdditionalInfo);
              return this;
          }

          return this;
      };

      this.abort = function () {
          if (state !== "new")
              return false;
          state = "aborted";
          xRequest.abort();
          return true;
      };
  }

  function sendRequest(request) {
      if (request.meta && request.meta.daemon) {
          fireEvent("beginDaemonRequest", [{ request: request }]);
      } else {
          fireEvent("beginRequest",
          [
              {
                  request: request,
                  requesting: requestPool.length > 0
              }
          ]);
      }

      var startTime, stacktrace;

      if (debugMode) {
          startTime = new Date();
          stacktrace = new Error().stack.replace(/^Error\s*\n/, "");
      }

      var bridge = new Bridge();

      // tìm trong cache
      var allowCache = !!request.meta.clientCache;
      var foundInCache = false;
      var cacheItem = null;
      if (allowCache) {
          var cacheResource = clientCacheData[request.resource];
          cacheItem = cacheResource ? cacheResource[request.url] : null;
          foundInCache = cacheItem && new Date() - cacheItem.t <= CACHE_AGE;
      }

      var x = foundInCache ? { abort: function () { } } : new XMLHttpRequest();
      var cr = new RestfullResult(x, bridge);

      if (request.clearCache)
          cr.done(function () {
              request.connection.clearCache();
          }).fail(function () {
              request.connection.clearCache();
          });

      if (foundInCache) {
          setTimeout(function (data, command, context) {
              bridge.fireSuccess(data.result, { cmd: command, context: context, meta: data.meta });
              bridge = null;
          }, 1, JSON.parse(cacheItem.o), request.command, request.context);

          if (debugMode) {
               console.log("found in cache: %O", {
                   request: request,
                   response: JSON.parse(cacheItem.o),
                   cacheAt: cacheItem.t
               });
          }
      }
      else {
          x.open(request.method, request.url, true);
          x.setRequestHeader("X-Requested-With", "XMLHttpRequest");
          x.setRequestHeader("Content-Type", "application/json");
          if (request.headers !== null && typeof request.headers === "object") {
              for (var headerName in request.headers) {
                  x.setRequestHeader(headerName, request.headers[headerName]);
              }
          }
          if (window.mushroom._requestTimeout)
              x.timeout = window.mushroom._requestTimeout;


          x.onreadystatechange = function () {
              if (this.readyState !== 4) return;

              if (this.status === 0) {
                  // aborted, error, timeout
                  return;
              }

              if (connectionStatus !== "online") {
                  connectionStatus = "online";
                  fireEvent("online");
              }

              var data;
              try {
                  data = JSON.parse(this.responseText);
              } catch (e) {
                  bridge.fireError({ code: 5, subCode: 0, detail: "Invalid response format" },
                      { cmd: request.command, context: request.context });
                  return;
              }

              if (data.code) {
                  bridge.fireError({
                      code: data.code,
                      subCode: data.subCode,
                      detail: data.detail,
                      result: data.result
                  },
                      { cmd: request.command, context: request.context });
                  return;
              }

              if (allowCache) {
                  var cacheResource = clientCacheData[request.resource] = clientCacheData[request.resource] || {};
                  cacheResource[request.url] = {
                      i: JSON.stringify(request.data), // input
                      o: this.responseText, // output
                      t: new Date()
                  };
              }
              allowCache = null;

              bridge.fireSuccess(data.result, { cmd: request.command, context: request.context, meta: data.meta });

              if (debugMode && window.mushroom._warning_slow_connection) {
                  var ms = new Date().getTime() - startTime.getTime();
                  if (ms >= 2000) {
                      console.warn("Slow response: " + ms + "ms\nStackTrace:\n" + stacktrace);
                  }
              }
          };
          x.addEventListener("timeout",
              function () {
                  //console.log("Connection timeout");
                  bridge.fireError({ code: 2, subCode: 0, detail: "Connection timeout" },
                      { cmd: request.command, context: request.context });
              });
          x.addEventListener(
              "abort",
              function () {
                  //console.log("Connection aborted");
                  bridge.fireError({ code: 3, subCode: 0, detail: "Connection aborted" },
                      { cmd: request.command, context: request.context });
              });
          x.addEventListener(
              "error",
              function () {
                  if (connectionStatus !== "offline") {
                      connectionStatus = "offline";
                      fireEvent("offline");
                  }
                  bridge.fireError({ code: 4, subCode: 0 }, { cmd: request.command, context: request.context });
              });

          x.send(request.data !== undefined && request.data !== null ? JSON.stringify(request.data) : null);
          if (x.readyState === 4)
              window.setTimeout(x.onreadystatechange);
      }

      cr.always(function (response, error, additionData) {
          for (var i = 0; i < requestPool.length; i++) {
              // thead safe: no
              if (requestPool[i].restfullResult === cr) {
                  requestPool.splice(i, 1);
                  break;
              }
          }

          if (request.meta && request.meta.daemon)
              fireEvent("endDaemonRequest",
              [
                  {
                      response: response,
                      error: error,
                      additionData: additionData
                  }
              ]);
          else {
              fireEvent("endRequest",
              [
                  {
                      response: response,
                      error: error,
                      additionData: additionData,
                      requesting: requestPool.length > 0
                  }
              ]);
          }

          request = null;
          bridge = null;
      });
      requestPool.push({
          cmd: request.command,
          daemon: request.meta && request.meta.daemon,
          restfullResult: cr
      });
      return cr;
  } 

  function fireEvent(eventName, args) {
      if (typeof (eventName) !== "string") throw new Error("eventName must be a string");
      if (eventName === "") throw new Error("eventName cannot be empty");

      if (!events[eventName])
          return;

      events[eventName].forEach(function (evt) {
          evt.apply(mushroom, args === undefined ? [] : args);
      });
  }

  function createRestFunction(config) {

      return function (dataOrSettings, settings) {

          if (config.blankBody) {
              settings = dataOrSettings;
          }

          var meta = config.meta;
          var requestMeta = meta || {};
          if (settings && "daemon" in settings) {
              requestMeta.daemon = !!settings.daemon;
          }
          
          var internalRequest = {
              action: config.name,
              connection: config.connection,
              resource: config.resource,
              method: config.method,
              url: typeof config.url === "function" ? config.url(settings, dataOrSettings) : config.url,
              context: settings ? settings.context : undefined,
              data: config.blankBody ? undefined : dataOrSettings,
              headers: config.headers || {},
              meta: requestMeta,
              clearCache: config.clearCache
          };

          var r;
          var foundParallel = false;
          if (requestMeta.clientCache && (requestMeta.clientCache === true || typeof requestMeta.clientCache === "object" && requestMeta.clientCache.allow && requestMeta.clientCache["default"]) && config.connection[config.name]) {
              var requesting = config.connection[config.name].__requesting;
              if (requesting && internalRequest.url === requesting.url && requesting.t - new Date() < CACHE_AGE) {
                  r = requesting.r;
                  foundParallel = true;

                  if (debugMode) {
                      console.log("Join: parallel API call (" + config.connection.__connection_namespace + "." + config.name + ")");
                  }
              } else
                  foundParallel = false;
          }

          if (!foundParallel) {

              fireEvent("beforeSend", [internalRequest]);

              if (typeof config.beforeSend === "function") {
                  config.beforeSend(internalRequest, settings, dataOrSettings);
              }
              r = sendRequest(internalRequest);
              if (config.connection[config.name]) {
                  var __requesting = {
                      r: r,
                      t: new Date(),
                      url: internalRequest.url
                  };
                  config.connection[config.name].__requesting = __requesting;

                  // xoa bo __requesting khi da thuc hien xong lenh
                  if (requestMeta.clientCache && (requestMeta.clientCache === true || typeof requestMeta.clientCache === "object" && requestMeta.clientCache.allow && requestMeta.clientCache["default"]))
                      r.always(function () {
                          if (config.connection[config.name].__requesting === __requesting) {
                              delete config.connection[config.name].__requesting.r;
                              delete config.connection[config.name].__requesting.t;
                              delete config.connection[config.name].__requesting;
                          }
                          __requesting = null;
                      });
              }
          }

          if (config.done)
              r.done(config.done);
          if (config.failure)
              r.fail(config.failure);
          if (config.always)
              r.always(config.always);

          if (settings && settings.done)
              r.done(settings.done);
          if (settings && settings.failure)
              r.fail(settings.failure);
          if (settings && settings.always)
              r.always(settings.always);

          return r;
      };
  }

  function findManyUrlGenerator(config) {
      return function (settings) {
          var base = config.rootApiUrl + config.name + "s/";
          if (settings === null || typeof settings !== "object")
              return base;

          var parameters = [];

          if (settings.filters) {
              if (typeof settings.filters === "string")
                  parameters.push(settings.filters);
              else if (Array.isArray(settings.filters)) {
                  settings.filters.forEach(function (item) {
                      parameters.push(item);
                  });
              }
          }

          if (settings.fields) {
              if (typeof settings.fields === "string")
                  parameters.push("$fields=" + encodeURIComponent(settings.fields));
              else if (Array.isArray(settings.fields))
                  parameters.push("$fields=" + settings.fields.map(function (item) { return encodeURIComponent(item); }).join(","));
          }

          if (settings.sort) {
              if (typeof settings.sort === "string")
                  parameters.push("$sort=" + encodeURIComponent(settings.sort));
              else if (Array.isArray(settings.sort))
                  parameters.push("$sort=" + sort.sort.map(function (item) { return encodeURIComponent(item); }).join(","));
          }

          if (typeof (settings.limit) === "number") {
              parameters.push("$limit=" + settings.limit);
          }

          if (typeof (settings.offset) === "number") {
              parameters.push("$offset=" + settings.offset);
          }

          if (typeof (settings.page) === "number") {
              parameters.push("$page=" + settings.page);
          }

          if (parameters.length) {
              base += "?" + parameters.join("&");
          }

          return base;
      };
  }

  function findByIdUrlGenerator(config) {
      return function (settings) {
          if (settings.id === null || settings.id === undefined || settings.id === "")
              throw new ReferenceError("findById thiếu id");

          var base = config.rootApiUrl + config.name + "s/" + settings.id;

          var parameters = [];

          if (settings.fields) {
              if (typeof settings.fields === "string")
                  parameters.push("$fields=" + encodeURIComponent(settings.fields));
              else if (Array.isArray(settings.fields))
                  parameters.push("$fields=" + settings.fields.map(function (item) { return encodeURIComponent(item); }).join(","));
          }

          if (parameters.length) {
              base += "?" + parameters.join("&");
          }

          return base;
      };
  }

  function entityViewUrlGenerator(config, viewName) {
      return function (args) {
          var base = config.rootApiUrl + config.name + "s/views/" + viewName;

          if (args === null || typeof args !== "object")
              return base;

          var parameters = [];
          
          for (var m in args) {
              if (!args.hasOwnProperty(m))
                  continue;

              var value = args[m];
              if (value === undefined)
                  continue;
              parameters.push(encodeURIComponent(m) + "=" + encodeURIComponent(args[m]));
          }

          if (parameters.length)
              base += "?" + parameters.join("&");

          return base;
      };
  }

  function resourceUrlGenerator(config) {
      return config.rootApiUrl + config.name + "s/";
  }

  function resourceIdUrlGenerator(config) {
      return function (settings, data) {
          var info = settings || data;
          if (info.id === null || info.id === undefined || info.id === "")
              throw new ReferenceError("Missing id");
          return config.rootApiUrl + config.name + "s/" + info.id;
      };
  }

  function viewUrlGenerator(config) {
      return function (settings) {
          var base = config.rootApiUrl + "view/" + config.name + "/";
          if (settings === null || typeof settings !== "object")
              return base;

          var parameters = [];

          if (settings.filters) {
              if (typeof settings.filters === "string")
                  parameters.push(settings.filters);
              else if (Array.isArray(settings.filters)) {
                  settings.filters.forEach(function (item) {
                      parameters.push(item);
                  });
              }
          }

          if (settings.fields) {
              if (typeof settings.fields === "string")
                  parameters.push("$fields=" + encodeURIComponent(settings.fields));
              else if (Array.isArray(settings.fields))
                  parameters.push("$fields=" + settings.fields.map(function(item) { return encodeURIComponent(item); }).join(","));
          }

          if (settings.sort) {
              if (typeof settings.sort === "string")
                  parameters.push("$sort=" + encodeURIComponent(settings.sort));
              else if (Array.isArray(settings.sort))
                  parameters.push("$sort=" + sort.sort.map(function(item) { return encodeURIComponent(item); }).join(","));
          }

          if (typeof (settings.limit) === "number") {
              parameters.push("$limit=" + settings.limit);
          }

          if (typeof (settings.offset) === "number") {
              parameters.push("$offset=" + settings.offset);
          }

          if (typeof (settings.page) === "number") {
              parameters.push("$page=" + settings.page);
          }

          if (parameters.length) {
              base += "?" + parameters.join("&");
          }

          return base;
      };
  }

  function clearCache() {
      delete clientCacheData[this.__connection_namespace];
  }

  var _rootApiUrl = null;

  window.resources = {};
  window.mushroom = {
      _defineResource: function (config) {
          if (!config || typeof config !== "object")
              throw new TypeError("config must be an object");
          if (typeof config.name !== "string")
              throw new TypeError("config.name must be a string");
          if (config.name === "")
              throw new TypeError("config.name cannot be a empty string");
          if (!config.rootApiUrl || typeof config.rootApiUrl !== "string")
              throw new TypeError("config.rootApiUrl must be a string url");

          window.resources[config.name.charAt(0).toString().toUpperCase() + config.name.substr(1)] = function () { }

          var cnn = window.mushroom[config.name] || {};
          cnn.clearCache = clearCache;
          Object.defineProperty(window.mushroom, config.name, {
              configurable: false,
              enumerable: true,
              value: cnn
          });

          Object.defineProperty(cnn, "__connection_namespace", {
              configurable: false,
              enumerable: true,
              value: config.name
          });

          Object.defineProperty(cnn, "__rootApiUrl", {
              configurable: false,
              enumerable: true,
              value: config.rootApiUrl
          });

          if (config.actions !== null && typeof config.actions === "object") {

              for (var actionName in config.actions) {
                  if (!config.actions.hasOwnProperty(actionName))
                      continue;

                  if (actionName === "findMany")
                      window.mushroom[config.name].list = createRestFunction({
                          name: "list",
                          connection: window.mushroom[config.name],
                          resource: config.name,
                          rootApiUrl: config.rootApiUrl,
                          method: "GET",
                          url: findManyUrlGenerator(config),
                          blankBody: true,
                          meta: config.actions[actionName], 
                          beforeSend: function (request, settings) {
                              if (settings && settings.filters && (settings.filters.indexOf("$$now") !== -1 || settings.filters.indexOf("$$today") !== -1)) {
                                  request.meta = request.meta || {};
                                  request.meta.clientCache = false;
                              }
                          }
                      });
                  else if (actionName === "findById")
                      window.mushroom[config.name].findById = createRestFunction({
                          name: "findById",
                          connection: window.mushroom[config.name],
                          resource: config.name,
                          rootApiUrl: config.rootApiUrl,
                          method: "GET",
                          url: findByIdUrlGenerator(config),
                          blankBody: true,
                          meta: config.actions[actionName]
                      });
                  else if (actionName === "createOne")
                      window.mushroom[config.name].create = createRestFunction({
                          name: "create",
                          connection: window.mushroom[config.name],
                          resource: config.name,
                          rootApiUrl: config.rootApiUrl,
                          method: "POST",
                          url: resourceUrlGenerator(config),
                          blankBody: false,
                          meta: config.actions[actionName],
                          clearCache: true
                      });
                  else if (actionName === "createMany")
                      window.mushroom[config.name].batchCreate = createRestFunction({
                          name: "batchCreate",
                          connection: window.mushroom[config.name],
                          resource: config.name,
                          rootApiUrl: config.rootApiUrl,
                          method: "POST",
                          url: resourceUrlGenerator(config),
                          blankBody: false,
                          meta: config.actions[actionName],
                          clearCache: true
                      });
                  else if (actionName === "updateOne")
                      window.mushroom[config.name].update = createRestFunction({
                          name: "update",
                          connection: window.mushroom[config.name],
                          resource: config.name,
                          rootApiUrl: config.rootApiUrl,
                          method: "PUT",
                          url: resourceIdUrlGenerator(config),
                          blankBody: false,
                          meta: config.actions[actionName],
                          clearCache: true
                      });
                  else if (actionName === "updateMany")
                      window.mushroom[config.name].batchUpdate = createRestFunction({
                          name: "batchUpdate",
                          connection: window.mushroom[config.name],
                          resource: config.name,
                          rootApiUrl: config.rootApiUrl,
                          method: "PUT",
                          url: resourceUrlGenerator(config),
                          blankBody: false,
                          meta: config.actions[actionName],
                          clearCache: true
                      });
                  else if (actionName === "updatePartially")
                      window.mushroom[config.name].partialUpdate = createRestFunction({
                          name: "partialUpdate",
                          connection: window.mushroom[config.name],
                          resource: config.name,
                          rootApiUrl: config.rootApiUrl,
                          method: "PATCH",
                          url: resourceIdUrlGenerator(config),
                          blankBody: false,
                          meta: config.actions[actionName],
                          clearCache: true
                      });
                  else if (actionName === "deleteOne")
                      window.mushroom[config.name].delete = createRestFunction({
                          name: "delete",
                          connection: window.mushroom[config.name],
                          resource: config.name,
                          rootApiUrl: config.rootApiUrl,
                          method: "DELETE",
                          url: resourceIdUrlGenerator(config),
                          blankBody: true,
                          meta: config.actions[actionName],
                          clearCache: true
                      });
                  else if (actionName === "deleteMany")
                      window.mushroom[config.name].batchDelete = createRestFunction({
                          name: "batchDelete",
                          connection: window.mushroom[config.name],
                          resource: config.name,
                          rootApiUrl: config.rootApiUrl,
                          method: "DELETE",
                          url: resourceUrlGenerator(config),
                          blankBody: false,
                          meta: config.actions[actionName],
                          clearCache: true
                      });
              }
          }

          window.mushroom[config.name].views = {};

          if (config.views !== null && typeof config.views === "object") {
              for (var viewName in config.views) {
                  if (!config.views.hasOwnProperty(viewName))
                      continue;

                  window.mushroom[config.name].views[viewName] = createRestFunction({
                      name: "view-" + viewName,
                      connection: window.mushroom[config.name],
                      resource: config.name,
                      rootApiUrl: config.rootApiUrl,
                      method: "GET",
                      url: entityViewUrlGenerator(config, viewName),
                      blankBody: true,
                      meta: config.views[viewName]
                  });
              }
          }
      },
      _defineView: function (config) {
          if (!config || typeof config !== "object")
              throw new TypeError("config must be an object");
          if (typeof config.name !== "string")
              throw new TypeError("config.name must be a string");
          if (config.name === "")
              throw new TypeError("config.name cannot be a empty string");
          if (!config.rootApiUrl || typeof config.rootApiUrl !== "string")
              throw new TypeError("config.rootApiUrl must be a string url");

          //window.resources[config.name.charAt(0).toString().toUpperCase() + config.name.substr(1)] = function () { }

          var cnn = window.mushroom["$view-" + config.name] || {};
          cnn.clearCache = clearCache;
          Object.defineProperty(window.mushroom.$view, config.name, {
              configurable: false,
              enumerable: true,
              value: cnn
          });

          Object.defineProperty(cnn, "__connection_namespace", {
              configurable: false,
              enumerable: true,
              value: config.name
          });

          Object.defineProperty(cnn, "__rootApiUrl", {
              configurable: false,
              enumerable: true,
              value: config.rootApiUrl
          });
          
          window.mushroom.$view[config.name] = createRestFunction({
              name: "$view",
              connection: window.mushroom["$view-" + config.name],
              resource: config.name,
              rootApiUrl: config.rootApiUrl,
              method: "GET",
              url: viewUrlGenerator(config),
              blankBody: true,
              meta: config.views[config.name],
              beforeSend: function (request, settings) {
                  if (settings && settings.filters && (settings.filters.indexOf("$$now") !== -1 || settings.filters.indexOf("$$today") !== -1)) {
                      request.meta = request.meta || {};
                      request.meta.clientCache = false;
                  }
              }
          });
      },
      _on: function (eventName, fnHandler) {
          if (typeof (eventName) !== "string") throw new Error("eventName must be a string");
          if (eventName === "") throw new Error("eventName cannot be empty");
          if (typeof (fnHandler) !== "function") throw new Error("fnHandler must be a callback function");

          var eventList = events[eventName];
          if (!eventList) eventList = events[eventName] = new Array();
          eventList.push(fnHandler);
          return this;
      },
      _unbindEvent: function (eventName, fnHandler) {
          if (typeof (eventName) !== "string") throw new Error("eventName must be a string");
          if (eventName === "") throw new Error("eventName cannot be empty");
          if (typeof (fnHandler) !== "function" && fnHandler !== undefined) throw new Error("fnHandler must be a callback function");

          var eventList = events[eventName];
          if (!eventList) return;
          if (fnHandler === undefined) {
              eventList.length = 0;
              return;
          }
          var idx = eventList.indexOf(fnHandler);
          if (idx !== -1) eventList.splice(idx, 1);
          return;
      },
      _hasEvent: function (eventName) {
          return eventName in events && events[eventName].length;
      },
      _abort: function (p) {
          if (p === undefined) {
              requestPool.slice(0).forEach(function (r) {
                  r.restfullResult.abort();
              });
          }
          else if (typeof p === "string") {
              if (p.indexOf("*") === -1)
                  requestPool.slice(0).forEach(function (r) {
                      if (r.cmd === p)
                          r.restfullResult.abort();
                  });
              else {
                  var re = new RegExp("^" + p.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&").replace(/\\\*/g, ".+") + "$");
                  requestPool.slice(0).forEach(function (r) {
                      if (re.test(r.cmd))
                          r.restfullResult.abort();
                  });
              }
          }
          else if (p && Array.isArray(p)) {
              p.forEach(function (item) {
                  window.mushroom._abort(item);
              });
          }
          else if (p instanceof RestfullResult) {
              p.abort();
          }
      },
      _config: function (key, value) {
          switch (key) {
          case "cache_age":
                  {
                      if (typeof value != "number" || value < 0) {
                          console.warn("Invalid 'cache_age' config, value must be a positive number or zero (disabled cache)");
                          return;
                      }
                      CACHE_AGE = value;
                      return;
                  }
          }
          console.warn("Unknown config key: '" + key + "'. Note: config key is case-sensitive.");
      },
      __createRestFunction: createRestFunction,
      $using: function (rootApiUrl) {
          if (rootApiUrl === undefined)
              return _rootApiUrl;
          _rootApiUrl = rootApiUrl;
          return this;
      },
      $view: {}
  };

  window.connection = {
      Bridge: Bridge,
      RestfullResult: RestfullResult
  };
})();