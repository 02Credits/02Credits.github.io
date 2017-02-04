define ["arbiter"], (arbiter) ->
  (command, args) ->
    if command == "\\refresh"
      args = args.trim()
      text = "<script>if (!localStorage.refresh#{args}) { localStorage.refresh#{args} = true; location.reload(); }</script>"
      arbiter.publish "messages/send", { text: text, author: localStorage.displayName }
