define ["arbiter"], (arbiter) ->
  (command, args) ->
    if command == "\\refresh"
      id = ""
      for i in [0..20]
        id += Math.floor(Math.random()*10).toString()
      text = "<script>if (!localStorage.refresh#{id}) { localStorage.refresh#{id} = true; location.reload(); }</script>"
      arbiter.publish "messages/send", { text: text, author: localStorage.displayName }
