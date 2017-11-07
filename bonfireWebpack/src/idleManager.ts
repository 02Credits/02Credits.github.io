import * as $ from "jquery";
import * as _ from "underscore";
import * as moment from "moment";
import * as m from "mithril";

import * as focusManager from "./focusManager";
import PouchDB from "./pouchdbManager";
import { rerender } from "./uiRenderer";

interface Status {
  name: string;
  lastSeen: number;
  lastConnected: number;
  status: string;
}

var remoteDB = new PouchDB<Status>('http://73.193.51.132:5984/statuses');

export async function render() {
  var results = await remoteDB.allDocs({
    include_docs: true,
    conflicts: false,
    attachments: false,
    binary: false,
    descending: true
  });
  return renderUserList(results.rows.map(row => row.doc));
}

async function renderUserList(userList: Status[]) {
  var renderedUsers = [];
  for (var user of userList) {
    if (user.name != localStorage.displayName) {
      var lastSeen = moment.utc(user.lastSeen);
      var lastConnected = moment.utc(user.lastConnected);
      var configFun = (element: HTMLElement, isInitialized: boolean) => {
        var rect = element.getBoundingClientRect();
        var hiddenElements = document.elementsFromPoint(rect.left, rect.top);
        if (_.any(hiddenElements, (element) => _.contains(element.classList, "message"))) {
          $(element).css('opacity', '0.0');
        } else {
          $(element).css('opacity', '1.0');
        }
        if (!isInitialized) {
          $(element).tooltip();
        }
      }
      var config = { "data-tooltip": user.status, "data-position": "left", config: configFun };
      var chipContents = {};
      if (moment().diff(lastConnected, "seconds") <= 30) {
        if (moment().diff(lastSeen, "minutes") <= 10) {
          chipContents = m(".chip.active.tooltipped",
                           config,
                           user.name);
        } else {
          chipContents = m(".chip.active.tooltipped",
                           config,
                          user.name + " " + lastSeen.fromNow());
        }
      }
      renderedUsers.push(m(".chip-wrapper", chipContents));
    }
  }
  return m("#seen-user-list", renderedUsers);
}

var lastSeen = moment();

$(document).ready(() => {
  $(this).mousemove(() => {
    lastSeen = moment();
  })

  $(this).keypress(() => {
    lastSeen = moment();
  })
})

setInterval(rerender, 1000);
setInterval(() => {
  remoteDB.upsert(localStorage.displayName, (doc) => {
    doc.name = localStorage.displayName;
    doc.lastSeen = lastSeen.utc().valueOf();
    doc.lastConnected = moment().utc().valueOf();
    doc.status = localStorage.status;
    return doc;
  });
}, 10000);
