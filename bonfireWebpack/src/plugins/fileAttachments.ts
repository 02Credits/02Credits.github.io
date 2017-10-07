import * as m from "mithril";
import * as fileCache from "../fileCache";
import PouchDB from "../pouchdbManager";
import { Plugin } from "../messageRenderer";

var db = new PouchDB("http://73.193.51.132:5984/attachments");

var fileAttachmentsPlugin: Plugin = {
  name: "fileAttachments",
  parent: "text",
  position: "after",

  render: async (doc, renderChildren) => {
    var children = await renderChildren(doc);
    if ("file" in doc || "files" in doc) {
      if ("file" in doc) {
        doc.files = [doc.file];
      }
      var renderedFiles: m.Vnode<any, any>[] = [];
      var filePromises = [];
      for (var file of doc.files) {
        filePromises.push((async () => {
          var fileData = await fileCache.FetchFile(file);
          if (fileData.id == file) {
            renderedFiles.push(m("p", (m("a", {href: URL.createObjectURL(fileData.attachment.data), download: fileData.name}, [
              fileData.name
            ]))));
          }
        })())
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

export default fileAttachmentsPlugin;
