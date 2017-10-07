import * as m from "mithril";
import {Plugin} from "../messageRenderer";

var titlePlugin: Plugin = {
  position: "before",
  name: "title",
  parent: "text",

  render: async (doc, renderBefore, renderInner, renderAfter) => {
    var beforeChildren = await renderBefore(doc);
    var innerChildren = await renderInner(doc);
    var afterChildren = await renderAfter(doc);
    if (!("author" in doc)) {
      doc.author = "error";
    }

    var titleClass = doc.fb ? ".card-title.fb-card-title" : ".card-title";
    var editIcon = doc.edited ? m("i.material-icons.editIcon", "mode_edit") : null;

    return [
      beforeChildren,
      m("span" + titleClass, [
        m.trust(doc.author),
        editIcon,
        innerChildren
      ]),
      afterChildren
    ];
  }
}

export default titlePlugin;
