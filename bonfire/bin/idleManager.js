// Generated by CoffeeScript 1.12.0
(function() {
  define(["jquery", "underscore", "pouchdbManager", "focusManager", "moment", "mithril", "arbiter"], function($, _, PouchDB, focusManager, moment, m, arbiter) {
    var lastSeen, remoteDB, render, renderUserList;
    remoteDB = new PouchDB('http://uwhouse.ddns.net:5984/statuses');
    render = function() {
      return remoteDB.allDocs({
        include_docs: true,
        conflicts: false,
        attachments: false,
        binary: false,
        descending: true
      }).then(function(results) {
        return renderUserList(results.rows);
      })["catch"](function(err) {
        return arbiter.publish("error", err);
      });
    };
    renderUserList = function(userList) {
      var config, configFun, lastConnected, lastSeen, user, userListTag;
      userListTag = $('#seen-user-list');
      return m.render(userListTag.get(0), (function() {
        var i, len, results1;
        results1 = [];
        for (i = 0, len = userList.length; i < len; i++) {
          user = userList[i];
          user = user.doc;
          if (user.name !== localStorage.displayName) {
            lastSeen = moment.utc(user.lastSeen);
            lastConnected = moment.utc(user.lastConnected);
            configFun = function(element, isInitialized) {
              var hiddenElements, rect;
              rect = element.getBoundingClientRect();
              hiddenElements = document.elementsFromPoint(rect.left, rect.top);
              if (_.any(hiddenElements, function(element) {
                return _.contains(element.classList, "message");
              })) {
                $(element).css('opacity', '0.0');
              } else {
                $(element).css('opacity', '1.0');
              }
              if (!isInitialized) {
                return $(element).tooltip();
              }
            };
            config = {
              "data-tooltip": user.status,
              "data-position": "left",
              config: configFun
            };
            results1.push(m(".chip-wrapper", moment().diff(lastConnected, "seconds") <= 30 ? moment().diff(lastSeen, "minutes") <= 10 ? m(".chip.active.tooltipped", config, "" + user.name) : m(".chip.inactive.tooltipped", config, user.name + " " + (lastSeen.fromNow())) : void 0));
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      })());
    };
    lastSeen = moment();
    $(document).ready(function() {
      $(this).mousemove(function(e) {
        return lastSeen = moment();
      });
      return $(this).keypress(function(e) {
        return lastSeen = moment();
      });
    });
    setInterval(function() {
      return render();
    }, 1000);
    return setInterval(function() {
      return remoteDB.upsert(localStorage.displayName, function(doc) {
        doc.name = localStorage.displayName;
        doc.lastSeen = lastSeen.utc().valueOf();
        doc.lastConnected = moment().utc().valueOf();
        doc.status = localStorage.status;
        return doc;
      })["catch"](function(err) {
        return arbiter.publish("error", err);
      });
    }, 10000);
  });

}).call(this);
