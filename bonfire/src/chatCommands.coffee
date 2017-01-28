define ["./commands/giphy", "./commands/emoticonDirectory"], ->
  commandProcessors = arguments
  (command, args) ->
    for commandProcessor in commandProcessors
      commandProcessor(command, args)
