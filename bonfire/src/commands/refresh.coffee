define ["arbiter"], (arbiter) ->
  (command, args) ->
    if command == "\\refresh"
      text = "<script>if (!localStorage.refreshid) { localStorage.refreshid = 0; } if (!localStorage[\"refresh\" + localStorage.refreshid.toString()]) { localStorage[\"refresh\" + localStorage.refreshid.toString()] = true; location.reload(); }</script>"
      arbiter.publish "messages/send", { text: text, author: localStorage.displayName }
