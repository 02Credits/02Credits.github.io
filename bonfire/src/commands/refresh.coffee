define ["arbiter"], (arbiter) ->
  (command, args) ->
    if command == "\\refresh"
      id = ""
      for i in [0..20]
        id += Math.floor(Math.random()*10).toString()
      text = """<script>
  if (!localStorage.refresh#{id}) {
    localStorage.refresh#{id} = true;

    var keithWidth = window.innerWidth * 0.7;
    var megaKeith = document.createElement("img");
    megaKeith.src = "./megaKeith/megaKeith.gif";
    megaKeith.style = "position: absolute; bottom: 0px; z-index: 10000; left: " + (window.innerWidth - keithWidth) * 0.5 + "px; width: " + keithWidth + "px;"
    document.body.appendChild(megaKeith);
    var audio = document.createElement("audio");
    audio.src = "./megaKeith/megaKeith.mp3";
    audio.volume = "0.4";
    audio.autoplay = "autoplay";
    document.body.appendChild(audio);

    if (window.nodeRequire) {
      var remote = nodeRequire('remote');
      var win = remote.getCurrentWindow();
      win.webContents.session.clearCache(function() {
        location.reload(true);
      });
    } else {
      location.reload(true);
    }
  }
</script>"""
      arbiter.publish "messages/send", { text: text, author: localStorage.displayName }
