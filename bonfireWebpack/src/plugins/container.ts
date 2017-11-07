import * as m from "mithril";
import * as inputManager from "../inputManager";
import { Plugin } from "../messageRenderer";

var linkify: Linkify.LinkifyInstance = require('linkify');

var containerPlugin: Plugin  = {
  name: "container",
  parent: "root",

  render: async (doc, renderBefore, renderInner, renderAfter) => {
    if ("text" in doc) {
      if (Array.isArray(doc.text)) {
        doc.links = [];
        for (var text of doc.text) {
          if ((text.text as string).indexOf("<") != 0) {
            for (var link of linkify.find((text.text as string))) {
              doc.links.push(link);
            }
          }
        }
      } else if (doc.text.indexOf("<") != 0) {
        doc.links = linkify.find(doc.text);
      }
    }

    var beforeChildren = await renderBefore(doc);
    var innerChildren = await renderInner(doc);
    var afterChildren = await renderAfter(doc);

    return m(".message-container", { key: doc["_id"] },
            m(".message.blue-grey.lighten-5", {
              ondblclick: () => {
                if (!Array.isArray(doc.text)) {
                  inputManager.startEdit(doc["_id"]);
                }
              }
            }, [
              beforeChildren,
              m(".message-content.black-text", innerChildren),
              afterChildren
            ]));
  }
}

export default containerPlugin;
