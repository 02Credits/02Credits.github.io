define ["arbiter"], (arbiter) ->
  (command, args) ->
    if command == "\\refresh"
      id = ""
      for i in [0..20]
        id += Math.floor(Math.random()*10).toString()
      text = "<script>if (!localStorage.refresh#{id} && window.nodeRequire) { localStorage.refresh#{id} = true; var remote = nodeRequire('remote'); var win = remote.getCurrentWindow(); win.webContents.session.clearCache(function() { location.reload(true); }); }</script>"
      arbiter.publish "messages/send", { text: text, author: localStorage.displayName }
