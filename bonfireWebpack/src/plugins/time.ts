import * as m from "mithril";
import * as moment from "moment";
import { Plugin } from "../messageRenderer";

var timePlugin: Plugin = {
  position: "after",
  name: "time",
  parent: "title",

  render: async (doc, renderBefore, renderInner, renderAfter) => {
    var beforeChildren = await renderBefore(doc);
    var innerChildren = await renderInner(doc);
    var afterChildren = await renderAfter(doc);

    if ("time" in doc) {
      var time = moment.utc(doc.time).local();
      var timeText = time.format("M/D/h:mm");
      return [
        beforeChildren,
        m("p.time-stamp.black-text.right", [
          timeText,
          innerChildren
        ]),
        afterChildren
      ];
    }
  }
}
export default timePlugin;
