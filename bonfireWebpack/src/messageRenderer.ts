import * as _ from "underscore";
import pluginsList from "./plugins";
import { Message } from "./messagesManager";
import * as m from "mithril";

export interface Plugin {
  name: string;
  parent: string;
  position?: string;
  beforePlugins?: Plugin[];
  innerPlugins?: Plugin[];
  afterPlugins?: Plugin[];
  render: (doc: Message,
           renderBefore?: (context: Message) => Promise<m.Vnode<any, any>[]>,
           renderInner?: (context: Message) => Promise<m.Vnode<any, any>[]>,
           renderAfter?: (context: Message) => Promise<m.Vnode<any, any>[]>) => any[] | any;
}

var plugins: Plugin[] = [];
for (var pluginList of pluginsList) {
  plugins = plugins.concat(pluginList);
}

export var root: Plugin = null;
export var pluginDirectory: { [name: string]: Plugin } = {};

for (var plugin of plugins) {
  if (plugin.parent == "root") {
    root = plugin;
  }
  pluginDirectory[plugin.name] = plugin;
  plugin.beforePlugins = [];
  plugin.innerPlugins = [];
  plugin.afterPlugins = [];
}

for (var plugin of plugins) {
  if (!(plugin.parent in pluginDirectory) && plugin.parent != "root") {
    throw "nonexistant plugin parent " + plugin.parent;
  } else if (plugin != root) {
    var parent = pluginDirectory[plugin.parent];
    if ("position" in parent) {
      if (plugin.position == "before") {
        parent.beforePlugins.push(plugin);
      } else if (plugin.position == "after") {
        parent.afterPlugins.push(plugin);
      } else if (plugin.position == "inner") {
        parent.innerPlugins.push(plugin);
      }
    } else {
      parent.innerPlugins.push(plugin);
    }
  }
}

function generateRenderChildren(children: Plugin[]) {
  return (context: Message) => {
    var promises: Promise<m.Vnode<any, any>>[] = [];
    for (var plugin of children) {
      promises.push(renderPlugin(context, plugin));
    }
    return Promise.all(promises);
  };
}

function renderPlugin(context: Message, plugin: Plugin) {
  var renderBefore = generateRenderChildren(plugin.beforePlugins);
  var renderInner = generateRenderChildren(plugin.innerPlugins);
  var renderAfter = generateRenderChildren(plugin.afterPlugins);
  var vEl = [];
  if (plugin.render.length == 4) {
    return plugin.render(context, renderBefore, renderInner, renderAfter);
  } else if (plugin.render.length == 3) {
    var renderInnerAndAfter = (context: Message) => {
      var children = []
        .concat(renderInner(context))
        .concat(renderAfter(context))
      return Promise.all(children);
    }
    return plugin.render(context, renderBefore, renderInnerAndAfter);
  } else {
    var renderAll = (context: Message) => {
      var children = []
        .concat(renderBefore(context))
        .concat(renderInner(context))
        .concat(renderAfter(context))
      return Promise.all(children);
    }
    return plugin.render(context, renderAll);
  }
}

export function render(message: Message) {
  return renderPlugin(message, root);
}
