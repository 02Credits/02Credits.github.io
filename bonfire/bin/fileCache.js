// Generated by CoffeeScript 1.12.0
(function() {
  define(["arbiter", "pouchdbManager"], function(arbiter, PouchDB) {
    var currentSize, db, fileMap, idQueue, maxSize;
    db = new PouchDB('http://parentalunit.ddns.net:5984/attachments');
    maxSize = 15 * 1000 * 1000 * 10;
    currentSize = 0;
    idQueue = [];
    fileMap = {};
    return arbiter.subscribe("files/fetch", function(fileId) {
      if (fileId in fileMap) {
        return arbiter.publish("file/data", fileMap[fileId]);
      } else {
        return db.get(fileId, {
          attachments: true,
          binary: true
        }).then(function(doc) {
          var attachment, name, poppedData, poppedId, ref, results;
          ref = doc["_attachments"];
          results = [];
          for (name in ref) {
            attachment = ref[name];
            currentSize += attachment.data.size;
            while (currentSize > currentSize) {
              poppedId = idQueue.shift();
              poppedData = fileMap[poppedId];
              delete fileMap[poppedId];
              currentSize = currentSize - poppedData.attachment.data.size;
            }
            idQueue.push(fileId);
            fileMap[fileId] = {
              id: fileId,
              name: name,
              attachment: attachment
            };
            results.push(arbiter.publish("file/data", fileMap[fileId]));
          }
          return results;
        });
      }
    });
  });

}).call(this);
