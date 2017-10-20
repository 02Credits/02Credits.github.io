import * as m from "mithril";

import { render as renderCards } from "./cards";
import { render as renderIdles } from "./idleManager";

export async function rerender() {
  m.render(document.body, [
    renderCards(),
    await renderIdles()
  ]);
}

rerender();
