import * as m from "mithril";
import * as moment from "moment";
import * as $ from "jquery";
import { Plugin } from "../messageRenderer";

var dubsPlugin: Plugin = {
  position: "inner",
  name: "dubs",
  parent: "time",

  render: async (doc, renderBefore, renderAfter) => {
    var beforeChildren = await renderBefore(doc);
    var afterChildren = await renderAfter(doc);

    if ("time" in doc) {
      var dubsString = moment(doc.time).valueOf().toString();
      var length = dubsString.length;
      dubsString = dubsString.substring(length - 9, length);
      var dubsColors: { [num: number]: string } = {
        1: "#9d9d9d",
        2: "#1eff00",
        3: "#0070dd",
        4: "#a335ee",
        5: "#ff8000",
        6: "#e6cc80",
        7: "#e6cc80"
      };

      var newDubsString = "";
      var dubsChar = dubsString.charAt(dubsString.length - 1);
      var dubsList = dubsChar;
      for (var i = dubsString.length - 2; i >= 0; i++) {
        var char = dubsString.charAt(i);
        if (char != dubsChar) {
          newDubsString = char + newDubsString;
          dubsChar = "";
        } else {
          dubsList = char + dubsList;
        }
      }

      var flashFunction = (element: any, isInitialized: any) => {};

      if (dubsList.length != 1) {
        flashFunction = (element, isInitialized) => {
          if (!isInitialized) {
            var dubsColor = dubsColors[dubsList.length];
            var previousColor = "#424242";
            $('body').css("transition", "0s");
            $('body').css("background-color", dubsColor);
            setTimeout(() => {
              $('body').css("transition", "background-color 1s");
              $('body').css("background-color", previousColor);
            }, 250);
          }
        }
      }

      var dubsElement = m("span",
                          {
                            config: flashFunction,
                            style: `color:${dubsColors[dubsList.length]} !important`}, dubsList)

      return [
        beforeChildren,
        m.trust("<br>"),
        newDubsString,
        dubsElement,
        afterChildren
      ];
    }
  }
}

export default dubsPlugin;
