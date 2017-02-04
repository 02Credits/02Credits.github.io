define [
  "./commands/giphy",
  "./commands/emoticonDirectory",
  "./commands/refresh"
], ->
  commandProcessors = arguments
  (command, args) ->
    for commandProcessor in commandProcessors
      commandProcessor(command, args)
