// Generated by CoffeeScript 1.12.0
(function() {
  define(["../emoticons", "arbiter"], function(emoticons, arbiter) {
    return function(command, args) {
      var emoticon, key, text;
      if (command === "\\emoticons") {
        text = "";
        for (key in emoticons.ourEmoticons) {
          emoticon = emoticons.genEmoticon(key, false);
          text = text + ("<p>" + key + ": " + emoticon + "</p>");
        }
        return arbiter.publish("messages/send", {
          text: text,
          author: localStorage.displayName
        });
      }
    };
  });

}).call(this);