import * as $ from "jquery";
import * as m from "mithril";

import {withKey} from "./utils";

if (!("displayName" in localStorage)) {
  var dumbNames = [
      "Village Idiot",
      "Dirty Peasant",
      "Dumbster",
      "assfaggot"
    ];
  var randomIndex = Math.floor(Math.random() * dumbNames.length);
  localStorage.displayName = dumbNames[randomIndex];
}

if (!("status" in localStorage)) {
  localStorage.status = "Breathing";
}

var settingsInputs = $(".settings-input");
settingsInputs.keydown((e: any) => {
  if (e.which == 13 || e.which == 27) {
    this.blur();
  }
});

settingsInputs.blur((e: any) => {
  localStorage[$(this).attr('id')] = $(this).val();
});

export function render() {
  var devToolsButton = null;
  if ("openDevTools" in window) {
    devToolsButton = m("a#dev-tools.btn", "Open Dev Tools");
  }

  return m("#modal-content", [
    m("h4", "Settings"),
    m(".settings-row", [
      m(".input", [
        m("input#displayName.settings-input", {
          onInput: m.withAttr("value", localStorage.displayName),
          value: localStorage.displayName
        }),
        m("label", {for: "displayName"}, "Name")
      ]),
      m(".input", [
        m("input#status.settings-input", {
          onInput: m.withAttr("value", localStorage.status),
          value: localStorage.status
        }),
        m("label", {for: "status"}, "Status")
      ]),
      devToolsButton
    ])
  ]);
}
