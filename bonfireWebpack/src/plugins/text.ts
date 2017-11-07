import * as m from "mithril";
import * as emoticons from "../emoticons";
import * as inputManager from "../inputManager";
import * as messagesManager from "../messagesManager";
import { Plugin } from "../messageRenderer";

var linkify = require('linkifyjs/html') as Linkify.LinkifyHTMLInstance;

function renderText(text: string, author: string, id: string) {
  var classText = text.indexOf(">") == 0 ? ".greentext" : "";
  if (text.indexOf("<") != 0) {
    var text = linkify(text, {
      "format": (value, typeOfString) => {
        if (typeOfString == "url" && value.length > 50) {
          value = value.slice(0, 50) + "...";
        }
        return value;
      }
    });
    if (emoticons.singleEmoticon(text)) {
      return m(".emoticon", {
        style: {width: "100%", textAlign: "center"},
        ondblclick: () => inputManager.startEdit(id)
      }, m.trust(emoticons.replace(text, id, author, true)));
    } else {
      text = emoticons.replace(text, id, author, false);
    }
  }
  return m("p" + classText, {
    ondblclick: () => inputManager.startEdit(id)
  }, m.trust(text));
}

var textPlugin: Plugin = {
  name: "text",
  parent: "container",

  render: async (doc, renderBefore, renderAfter) => {
    var beforeChildren = await renderBefore(doc);
    var afterChildren = await renderAfter(doc);
    if ("text" in doc) {
      if (Array.isArray(doc.text)) {
        var elements: (m.Vnode<any, any>[] | m.Vnode<any, any>)[] = [beforeChildren];
        for (var text of doc.text) {
          elements.push(renderText(text.text as string, doc.author, text["_id"]));
        }
        elements.push(afterChildren);
        return elements;
      } else {
        return [
          beforeChildren,
          renderText(doc.text, doc.author, doc["_id"]),
          afterChildren
        ];
      }
    } else {
      return [
        beforeChildren,
        afterChildren
      ];
    }
  }
}

export default textPlugin;
