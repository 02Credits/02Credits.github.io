import PouchDB from "./pouchdbManager";

const maxSize = 15 * 1000 * 1000 * 10;

export interface FileCacheElement {
  name: string;
  id: string,
  attachment: {
    data: Blob;
    content_type: string;
  };
}

export interface AttachmentEntry {
  _id: string;
  messageNumber: string;
  _attachments: {
    [id: string]: any
  }
}


var db = new PouchDB<AttachmentEntry>('http://73.193.51.132:5984/attachments');
var currentSize = 0;
var idQueue: string[] = [];
var fileMap: { [id: string]: FileCacheElement } = {};

export async function FetchFile(fileId: string) {
  if (!(fileId in fileMap)) {
    var doc = await db.get(fileId, {attachments: true, binary: true})
    for (var name in doc["_attachments"]) {
      var attachment = doc["_attachments"][name];
      currentSize += attachment.data.size;
      while (currentSize > currentSize) {
        var poppedId = idQueue.shift();
        var poppedData = fileMap[poppedId];
        delete fileMap[poppedId];
        currentSize = currentSize - poppedData.attachment.data.size;
      }
      idQueue.push(fileId);
      fileMap[fileId] = {id: fileId, name: name, attachment: attachment};
    }
  }
  return fileMap[fileId];
}
