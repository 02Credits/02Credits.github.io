// Generated by CoffeeScript 1.12.0
(function() {
  define(["jquery", "underscore", "pouchdbManager", "mithril", "moment", "pouchdb-collate", "messageRenderer", "inputManager", "arbiter", "scrollManager"], function($, _, PouchDB, m, moment, collate, messageRenderer, inputManager, arbiter, scrollManager) {
    var currentServer, handleChange, localDB, remoteChanges, remoteDB, render, renderMessages;
    remoteDB = new PouchDB('http://uwhouse.ddns.net:5984/messages');
    localDB = new PouchDB('messages');
    currentServer = remoteDB;
    handleChange = function(change) {
      render();
      if (change.doc.author !== localStorage.displayName) {
        if (typeof notifier !== "undefined" && notifier !== null) {
          return notifier.notify(true);
        }
      }
    };
    render = function() {
      if (!inputManager.searching) {
        return currentServer.allDocs({
          include_docs: true,
          conflicts: false,
          attachments: true,
          binary: true,
          limit: scrollManager.messages,
          descending: true,
          startkey: "_design"
        }).then(function(results) {
          return renderMessages(results.rows.reverse());
        })["catch"](function(err) {
          return arbiter.publish("error", err);
        });
      }
    };
    renderMessages = function(messages) {
      var currentAuthor, currentMessage, doc, groupedMessages, i, len, message;
      messages = _.filter(messages, function(message) {
        var doc;
        doc = message.doc;
        return (doc.text != null) && (doc.author != null);
      });
      groupedMessages = [];
      currentAuthor = {};
      currentMessage = null;
      for (i = 0, len = messages.length; i < len; i++) {
        message = messages[i];
        if (message.doc.text.startsWith("<")) {
          if (currentMessage != null) {
            groupedMessages.push(currentMessage);
            currentMessage = null;
          }
          groupedMessages.push(message);
        } else {
          if (currentMessage != null) {
            if (currentMessage.doc.author === message.doc.author && moment.utc(message.doc.time).diff(moment.utc(currentMessage.doc.time), 'minutes') < 2) {
              if (message.doc.edited) {
                currentMessage.doc.edited = true;
              }
              currentMessage.doc.time = message.doc.time;
              currentMessage.doc.text.push({
                text: message.doc.text,
                id: message.doc._id
              });
            } else {
              groupedMessages.push(currentMessage);
              currentMessage = message;
              message.doc.text = [
                {
                  text: message.doc.text,
                  id: message.doc._id
                }
              ];
            }
          } else {
            currentMessage = message;
            message.doc.text = [
              {
                text: message.doc.text,
                id: message.doc._id
              }
            ];
          }
        }
      }
      if (currentMessage != null) {
        groupedMessages.push(currentMessage);
      }
      m.render($('#messages').get(0), m("div", (function() {
        var j, len1, results1;
        results1 = [];
        for (j = 0, len1 = groupedMessages.length; j < len1; j++) {
          message = groupedMessages[j];
          doc = message.doc;
          results1.push(messageRenderer.render(doc));
        }
        return results1;
      })()));
      return arbiter.publish("messages/rendered");
    };
    remoteChanges = remoteDB.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', handleChange).on('error', function(err) {
      return arbiter.publish("error", err);
    });
    localDB.sync(remoteDB).then(function() {
      $('.progress').fadeOut();
      localDB.changes({
        since: 'now',
        live: true,
        include_docs: true
      }).on('change', handleChange).on('error', function(err) {
        return arbiter.publish("error", err);
      });
      remoteChanges.cancel();
      return currentServer = localDB;
    })["catch"](function(err) {
      return arbiter.publish("error", err);
    });
    render();
    $('#input').prop('disabled', false);
    arbiter.subscribe("messages/render", function(messages) {
      if (messages == null) {
        return render();
      } else {
        return renderMessages(messages);
      }
    });
    arbiter.subscribe("messages/edit", function(args) {
      var id, text;
      id = args.id;
      text = args.text;
      return currentServer.get(id).then(function(doc) {
        doc.text = text;
        doc.edited = true;
        return currentServer.put(doc);
      })["catch"](function(err) {
        return arbiter.publish("error", err);
      });
    });
    arbiter.subscribe("messages/search", function(query) {
      return currentServer.search({
        query: query,
        fields: ['author', 'text'],
        include_docs: true
      }).then(function(results) {
        return renderMessages(results.rows.reverse());
      });
    });
    arbiter.subscribe("messages/send", function(args) {
      var author, text;
      text = args.text;
      author = args.author;
      if ((text != null) && (author != null)) {
        return currentServer.allDocs({
          include_docs: true,
          conflicts: false,
          limit: 1,
          descending: true,
          startkey: "_design"
        }).then(function(results) {
          var doc, id, idNumber, messageNumber, now, time;
          doc = results.rows[0].doc;
          now = moment().utc();
          time = now.valueOf();
          messageNumber = (parseInt(doc.messageNumber) + 1).toString();
          idNumber = parseInt(messageNumber.toString() + time.toString());
          id = collate.toIndexableString(idNumber).replace(/\u0000/g, '\u0001');
          return currentServer.put({
            "_id": id,
            "messageNumber": messageNumber,
            "time": time,
            "author": author,
            "text": text
          });
        })["catch"](function(err) {
          return arbiter.publish("error", err);
        });
      }
    });
    arbiter.subscribe("messages/getLast", function(callback) {
      return currentServer.query("by_author", {
        key: localStorage.displayName,
        limit: 1,
        include_docs: true,
        descending: true
      }).then(function(result) {
        return callback(result.rows[0].doc);
      })["catch"](function(err) {
        return arbiter.publish("error", err);
      });
    });
    return arbiter.subscribe("messages/get", function(args) {
      var callback, id;
      id = args.id;
      callback = args.callback;
      return currentServer.get(id).then(function(doc) {
        return callback(doc);
      })["catch"](function(err) {
        return arbiter.publish("error", err);
      });
    });
  });

}).call(this);
