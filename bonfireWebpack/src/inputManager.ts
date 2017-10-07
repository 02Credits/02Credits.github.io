import * as $ from "jquery";
import * as _ from "underscore";
import * as messagesManager from "./messagesManager";
import * as chatCommands from "./chatCommands";

var input = $("#input");

export var editing = false;
export var searching = false;

var messageIdToEdit = "";
var sendMessage = _.throttle(() => {
  var text = input.val() as string;
  input.val('');

  if (text != "") {
    var commandRegex = /^\\[^\s]+/;
    var possibleMatch = text.match(commandRegex);
    if (possibleMatch != null || possibleMatch != undefined) {
      chatCommands.processCommand(possibleMatch[0], text.substring(possibleMatch[0].length));
    } else if (editing) {
      messagesManager.editMessage(messageIdToEdit, text, false);
      input.removeClass("editing");
    } else if (searching) {
      messagesManager.search(text);
    } else {
      messagesManager.send({text: text, author: localStorage.displayName});
    }
    editing = false;
  } else {
    clear();
  }
}, 1000, {trailing: false});

function editDoc(doc: messagesManager.Message) {
  input.val(doc.text as string);
  editing = true;
  searching = false;
  input.removeClass("searching");
  messageIdToEdit = doc["_id"];
  input.addClass("editing");
  input.focus();
}

function clear(e?: JQuery.Event<HTMLElement, null>) {
  if (e != null && e != undefined) {
    e.preventDefault();
  }
  editing = false;
  searching = false;
  input.removeClass("editing");
  input.removeClass("searching");
  $('.progress').fadeOut();
  input.val("");
  messagesManager.render();
}

$(document).keydown((e: JQuery.Event<HTMLElement, null>) => {
  if (e.which == 13) {
    e.preventDefault();
    sendMessage();
  } else if (e.which == 40) {
    clear(e);
    searching = true;
    editing = false;
    input.removeClass("editing");
    input.addClass("searching");
    $('.progress').fadeOut();
    input.focus();
  } else if (e.which == 27) {
    clear(e);
  } else if (e.which == 38) {
    messagesManager.getLast(editDoc);
  }
});

if (openDevTools != null && openDevTools != undefined) {
  $('#dev-tools')
    .css("visibility", "visible")
    .click(openDevTools);
}

export async function startEdit(id: string) {
  var doc = await messagesManager.getMessage(id);
  if (doc.author == localStorage.displayName) {
    editDoc(doc);
  }
}
