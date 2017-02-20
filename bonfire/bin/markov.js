// Generated by CoffeeScript 1.12.0
(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(["pouchdbManager", "arbiter"], function(PouchDB, arbiter) {
    var authorMappings, messages, pickWeighted, setupData, stepObject;
    messages = new PouchDB('http://uwhouse.ddns.net:5984/messages');
    authorMappings = {
      Jonjo: ["JonJo"],
      Derek: ["Derek", "Daeryk", "Derk"],
      Honry: ["Honry", "Henry", "Eri", "Honri"],
      Keith: ["Keith", "Keith Surface", "Keith Test", "Keith Mobile"]
    };
    stepObject = function(obj) {
      var count, keys, result;
      keys = Object.keys(obj);
      count = 0;
      result = [];
      keys.forEach(function(key) {
        var i, j, ref, results1;
        count = count + obj[key];
        results1 = [];
        for (i = j = 1, ref = obj[key]; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
          results1.push(result.push(key));
        }
        return results1;
      });
      return {
        count: count,
        result: result
      };
    };
    pickWeighted = function(steppedObj) {
      var index;
      index = Math.floor(Math.random() * steppedObj.count);
      return steppedObj.result[index];
    };
    setupData = function(lines) {
      var data, dataKeys, starters;
      data = {};
      starters = {};
      lines.forEach(function(line) {
        var entry, first, i, j, key, ref, res, results1, second, text, words;
        line.trim();
        if (line && ("" !== line)) {
          text = line.toLowerCase();
          if (!text.startsWith("<")) {
            words = text.split(" ");
            if (words.length > 3) {
              results1 = [];
              for (i = j = 0, ref = words.length - 2; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
                first = words[i];
                second = words[i + 1];
                res = words[i + 2];
                key = first + " " + second;
                if (i === (words.length - 3)) {
                  res = res + "\n";
                }
                if (i === 0) {
                  if (indexOf.call(starters, key) >= 0) {
                    starters[key]++;
                  } else {
                    starters[key] = 1;
                  }
                }
                if (indexOf.call(data, key) >= 0) {
                  entry = data[key];
                  if (indexOf.call(entry, res) >= 0) {
                    results1.push(entry[res]++);
                  } else {
                    results1.push(entry[res] = 1);
                  }
                } else {
                  data[key] = {};
                  results1.push(data[key][res] = 1);
                }
              }
              return results1;
            }
          }
        }
      });
      starters = stepObject(starters);
      dataKeys = Object.keys(data);
      dataKeys.forEach(function(key) {
        return data[key] = stepObject(data[key]);
      });
      return {
        data: data,
        starters: starters
      };
    };
    return function(author, id) {
      var actualNames, alternateName;
      if (author in authorMappings) {
        actualNames = authorMappings[author];
        return Promise.all((function() {
          var j, len, results1;
          results1 = [];
          for (j = 0, len = actualNames.length; j < len; j++) {
            alternateName = actualNames[j];
            results1.push(messages.query("by_author", {
              key: alternateName
            }));
          }
          return results1;
        })()).then(function(results) {
          var j, k, last, len, len1, line, lines, next, ref, response, result, row, secondToLast, starter, starterWords;
          lines = [];
          for (j = 0, len = results.length; j < len; j++) {
            result = results[j];
            ref = result.rows;
            for (k = 0, len1 = ref.length; k < len1; k++) {
              row = ref[k];
              lines.push(row.value);
            }
          }
          response = setupData(lines);
          starter = pickWeighted(response.starters);
          starterWords = starter.split(" ");
          secondToLast = starterWords[0];
          last = starterWords[1];
          line = starter;
          while (true) {
            next = pickWeighted(response.data[secondToLast + " " + last]);
            line += " " + next;
            if (next.endsWith("\n")) {
              break;
            }
            secondToLast = last;
            last = next;
          }
          return arbiter.publish("messages/edit", {
            id: id,
            text: ("Mini" + author + " says: ") + line.charAt(0).toUpperCase() + line.slice(1),
            skipMarkEdit: true
          });
        })["catch"](function(reason) {
          console.log(reason);
          return arbiter.publish("messages/edit", {
            id: id,
            text: "Mini" + author + " had an error...",
            skipMarkEdit: true
          });
        });
      }
    };
  });

}).call(this);
