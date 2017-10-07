import * as emoticons from "../emoticons";
import * as messagesManager from "../messagesManager";

export default function (command: string, args: string) {
  if (command == "\\emoticons") {
    var text = "";
    for (var key in emoticons.ourEmoticons) {
      var emoticon = emoticons.genEmoticon(key, false);
      text += `<p>${key}: ${emoticon}</p>`
    }
    for (var key in emoticons.textEmoticons) {
      var value = emoticons.textEmoticons[key];
      text += `<p>${key}: ${value}</p>`;
    }
    messagesManager.send({ text: text, author: localStorage.displayName });
  }
}
