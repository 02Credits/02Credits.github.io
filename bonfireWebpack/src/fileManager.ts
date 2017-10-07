import * as $ from "jquery";
import * as moment from "moment";
import PouchDB from "./pouchdbManager";
import * as messagesManager from "./messagesManager";
import * as errorLogger from "./errorLogger";

var db = new PouchDB<messagesManager.Message>('http://73.193.51.132:5984/attachments');
var div = document.getElementById('content');
div.ondragenter = div.ondragover = (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
  return false
}

var uploadFiles = async (files: FileList) => {
  try {
    for (var file of files as any) {
      var blob = file.slice()
      if (blob.size > 15000000) {
        messagesManager.send({author: localStorage.displayName, text: "FILE TOO BIG"});
      } else {
        var results = await db.allDocs({
          include_docs: true,
          conflicts: false,
          limit: 1,
          descending: true,
          startkey: "_design"
        })
        var messageNumber = 0
        if (results.rows.length > 0) {
          messageNumber = parseInt(results.rows[0].doc.messageNumber) + 1
        }
        var time = moment().utc().valueOf()
        var id = messageNumber.toString() + time.toString()
        var attachments: any = {}
        attachments[file.name] = {
          data: blob,
          content_type: file.type
        };
        await db.put({
          _id: id,
          messageNumber: messageNumber.toString(),
          _attachments: attachments
        });
        messagesManager.send({author: localStorage.displayName, file: id});
      }
    }
  } catch (err) {
    errorLogger.handleError(err);
  }
}

div.ondrop = (e) => {
  try {
    var url = e.dataTransfer.getData('URL');
    var sent = false;
    if (url != "") {
      sent = true
      $('.progress').fadeIn()
      $.ajax({
        url: 'https://api.imgur.com/3/image',
        headers:
          {'Authorization': 'Client-ID c110ed33b325faf'},
        type: 'POST',
        data: {
          'image': url,
          'Authorization': 'Client-ID c110ed33b325faf'
        },
        success: (result: any) => {
          messagesManager.send({text: result.data.link, author: localStorage.displayName});
          $('.progress').fadeOut()
        },
        error: () => {
          Materialize.toast("Image URL Upload Failed", 4000)
        }
      });
      $('.progress').fadeOut();
    } else {
      if (e.dataTransfer.files.length != 0)
        uploadFiles(e.dataTransfer.files);
    }
  } catch (error) {
    errorLogger.handleError(error);
  }
  e.preventDefault();
}
