// Generated by CoffeeScript 1.12.3
(function() {
  define(["./commands/giphy", "./commands/emoticonDirectory", "./commands/refresh"], function() {
    var commandProcessors;
    commandProcessors = arguments;
    return function(command, args) {
      var commandProcessor, i, len, results;
      results = [];
      for (i = 0, len = commandProcessors.length; i < len; i++) {
        commandProcessor = commandProcessors[i];
        results.push(commandProcessor(command, args));
      }
      return results;
    };
  });

}).call(this);
