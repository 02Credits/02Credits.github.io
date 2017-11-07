import * as $ from "jquery";
import * as _ from "underscore";
import * as moment from "moment";
import * as m from "mithril";
import * as collate from "pouchdb-collate";
import * as inputManager from "./inputManager";
import PouchDB from "./pouchdbManager";
import * as scrollManager from "./scrollManager";
import * as messageRenderer from "./messageRenderer";
import { EventManager0 } from "./eventManager";

import {EventManager1, EventManager3} from "./eventManager";

var remoteDB = new PouchDB<Message>('http://73.193.51.132:5984/messages');
var localDB = new PouchDB<Message>('messages');

var currentDB = remoteDB;
var caughtUp = false;
var editPrimed = false;
var searchPrimed = false;

export interface Message {
  _id?: string;
  text?: string | Message[];
  author?: string;
  edited?: boolean;
  time?: number;
  messageNumber?: string;
  file?: string;
  files?: string[];
  links?: { type: string, value: string, href: string }[];
  fb?: boolean
}

function handleChange (change: PouchDB.Core.ChangesResponseChange<Message>) {
  render()
  if (change.doc.author != localStorage.displayName) {
    if (notifier != null && notifier != undefined) {
      notifier.notify(true);
    }
  }
}

function primeQueries () {
  if (caughtUp) {
    localDB.query("by_author", {
      key: localStorage.displayName,
      limit: 1,
      descending: true
    }).then(() => {
      if (!editPrimed) {
        editPrimed = true;
      }
    });
    localDB.search({
      fields: ['text'],
      build: true
    }).then(() => {
      if (!searchPrimed) {
        searchPrimed = true;
      }
    });
  }
}

export var MessagesRendered = new EventManager0();
async function renderMessages (messages: Message[], preventCombining = false) {
  messages = _.filter(messages, (message: Message) => "author" in message);
  var groupedMessages = [];
  var currentAuthor = {};
  var currentMessage = null;
  for (var message of messages)
    if (!("text" in message) || (!Array.isArray(message.text) && message.text.startsWith("<"))) {
      if (currentMessage != null) {
        groupedMessages.push(currentMessage);
        currentMessage = null;
      }
      groupedMessages.push(message);
    } else {
      if (currentMessage != null) {
        if (currentMessage.author == message.author &&
            moment.utc(message.time).diff(moment.utc(currentMessage.time), 'minutes') < 2 &&
            !preventCombining &&
            Array.isArray(currentMessage.text)) {
          if (message.edited) {
            currentMessage.edited = true
          }
          currentMessage.text.push({text: message.text, _id: message._id});
        } else {
          groupedMessages.push(currentMessage);
          currentMessage = message;
          message.text = [{text: message.text, _id: message._id}];
        }
      } else {
        currentMessage = message;
        message.text = [{text: message.text, _id: message._id}];
      }
    }
  if (currentMessage != null) {
    groupedMessages.push(currentMessage);
  }

  var messagePromises = [];
  for (var message of groupedMessages) {
    var renderedMessage = messageRenderer.render(message);
    if (renderedMessage != null) {
      messagePromises.push(renderedMessage)
    }
  }
  return Promise.all(messagePromises).then((renderedMessages) => {
    m.render($('#messages').get(0),
      m("div",
        renderedMessages));
    MessagesRendered.Publish();
  });
}

export function render () {
  if (!inputManager.searching) {
    currentDB.allDocs({
      include_docs: true,
      conflicts: false,
      attachments: true,
      binary: true,
      limit: scrollManager.messages,
      descending: true,
      startkey: "_design"
    }).then((results) => {
      renderMessages(results.rows.reverse().map(row => row.doc));
    });
  }
}


render();
var remoteChanges = remoteDB.changes({
  "since": 'now',
  "live": true,
  "include_docs": true
}).on('change', handleChange)

localDB.sync(remoteDB)
  .then(() => {
    caughtUp = true;
    primeQueries();
    localDB.sync(remoteDB, {
      live: true,
      retry: true
    });

    localDB.changes({
      "since": 'now',
      "live": true,
      "include_docs": true
    }).on('change', handleChange)

    remoteChanges.cancel();
    currentDB = localDB;
  });

$('#input').prop('disabled', false);


export function editMessage(id: string, text: string, skipMarkEdit: boolean) {
  currentDB.get(id)
    .then((doc) => {
      doc.text = text;
      if (!skipMarkEdit) {
        doc.edited = true;
      }
      currentDB.put(doc as any);
    });
}

export function search(query: string) {
  if (caughtUp) {
    renderMessages([]);
    localDB.search({
      "query": query,
      "fields": ['text'],
      "include_docs": true
    }).then((results) => {
      renderMessages(results.rows.reverse().map(row => row.doc), true);
    });
  } else {
  }
}

export function send(doc: Message) {
  currentDB.allDocs({
    "include_docs": true,
    "conflicts": false,
    "limit": 1,
    "descending": true,
    "startkey": "_design"
  }).then((results) => {
    var lastDoc = results.rows[0].doc;
    var now = moment().utc();
    doc.time = now.valueOf();
    doc.messageNumber = (parseInt(lastDoc.messageNumber) + 1).toString();
    var idNumber = parseInt(doc.messageNumber.toString() + doc.time.toString());
    doc["_id"] = collate.toIndexableString(idNumber).replace(/\u000/g, '\u0001');
    currentDB.put(doc);
  });
}

export async function getLast(callback: (message: Message) => void) {
  if (caughtUp) {
    var result = await currentDB.query("by_author", {
      "key": localStorage.displayName,
      "limit": 1,
      "include_docs": true,
      "descending": true
    });

    callback(result.rows[0].doc as any as Message);
  } else {
  }
}

export async function getMessage(id: string) {
  return await currentDB.get(id);
}
// setInterval(primeQueries, 10000);
