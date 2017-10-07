import * as $ from "jquery";
import * as _ from "underscore";
import * as inputManager from "./inputManager";
import * as messagesManager from "./messagesManager";

export var scrollElement = $('#messages');
export var messages = 50;
export var stuck = true;

function atBottom() {
  if (scrollElement != null && scrollElement != undefined) {
    return scrollElement[0].scrollHeight - scrollElement.scrollTop() == scrollElement.outerHeight();
  } else {
    return true;
  }
}

function atTop() {
  if (scrollElement != null && scrollElement != undefined) {
    return scrollElement.scrollTop() == 0;
  } else {
    return true;
  }
}

function addMessagesNonThrottled() {
  if (!inputManager.searching) {
    var scrollHeight = scrollElement[0].scrollHeight;
    messages += 50;
    messagesManager.render();
    var token: number;
    token = messagesManager.MessagesRendered.Subscribe(() => {
      messagesManager.MessagesRendered.Unsubscribe(token);
      scrollElement.scrollTop(scrollElement[0].scrollHeight - scrollHeight);
    })
  }
}

var addMessages = _.throttle(addMessagesNonThrottled, 1000, {trailing: false});

function onMouseWheel(e: {wheelDelta: number}) {
  if (e.wheelDelta > 0) {
    stuck = false;
  } else {
    stuck = atBottom();
  }
}

export function scrollToBottom() {
  scrollElement.scrollTop(scrollElement[0].scrollHeight);
}

export function scrollIfStuck() {
  if (stuck) {
    messages = 50;
    scrollToBottom();
  } else if (atTop) {
    addMessages();
  }
}

setInterval(scrollIfStuck, 100);
scrollElement.scroll(scrollIfStuck);

export var lastTouchY = 0;
function touchShim(e: TouchEvent) {
  var touchY = e.targetTouches[0].pageY;
  onMouseWheel({ wheelDelta: lastTouchY - touchY });
  lastTouchY = touchY;
}

document.addEventListener("mousewheel", onMouseWheel, true);
document.addEventListener("touchmove", touchShim, true);
