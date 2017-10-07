import * as m from "mithril";
import * as fileCache from "../fileCache";
import PouchDB from "../pouchdbManager";
import { Plugin } from "../messageRenderer";

var db = new PouchDB('http://73.193.51.132:5984/attachments');

var imageAttachmentsPlugin: Plugin = {
  name: "imageAttachments",
  parent: "images",

  render: async (doc, renderChildren) => {
    var children = await renderChildren(doc);
    if ("file" in doc || "files" in doc) {
      if (doc.file) {
        doc.files = [doc.file];
      }
      var renderedFiles: m.Vnode<any, any>[] = [];
      var filePromises = [];
      for (var file of doc.files) {
        filePromises.push((async () => {
          var fileData = await fileCache.FetchFile(file);
          if (fileData.id == file) {
            if (fileData.attachment.content_type.startsWith("image")) {
              renderedFiles.push(m("img.materialboxed", {src: URL.createObjectURL(fileData.attachment.data)}));
            }
          }
        })());
      }
      await Promise.all(filePromises);
      return [
        renderedFiles,
        children
      ];
    } else {
      return [children];
    }
  }
}

export default imageAttachmentsPlugin;
