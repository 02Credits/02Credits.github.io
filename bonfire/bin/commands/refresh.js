// Generated by CoffeeScript 1.12.0
(function() {
  define(["arbiter"], function(arbiter) {
    return function(command, args) {
      var i, id, j, text;
      if (command === "\\refresh") {
        id = "";
        for (i = j = 0; j <= 20; i = ++j) {
          id += Math.floor(Math.random() * 10).toString();
        }
        text = "<script>\nif (!localStorage.refresh" + id + ") {\n  localStorage.refresh" + id + " = true;\n\n  var keithWidth = window.innerWidth * 0.7;\n  var megaKeith = document.createElement(\"img\");\n  megaKeith.src = \"./megakeith/megaKeith.gif\";\n  megaKeith.style = \"position: absolute; bottom: 0px; z-index: 10000; left: \" + (window.innerWidth - keithWidth) * 0.5 + \"px; width: \" + keithWidth + \"px;\"\n  document.body.appendChild(megaKeith);\n  var audio = document.createElement(\"audio\");\n  audio.src = \"./megakeith/megaKeith.mp3\";\n  audio.volume = \"0.1\";\n  audio.autoplay = \"autoplay\";\n  document.body.appendChild(audio);\n\n  window.setInterval(function () {\n    var smokeId = \"\";\n    for (var i = 0; i < 20; i++) {\n      smokeId += Math.floor(Math.random() * 10).toString();\n    }\n    var smokeKeyFrames = \"@keyframes Smoke\" + smokeId + \" { 0% { opacity: 0; bottom: -200px; transform: rotate(\" + Math.random() * 360 + \"deg); } 80% { opacity: 0.8; } 100% { opacity: 0; transform: rotate(\" + Math.random() * 360 + \"deg); bottom: 50px; }\"\n    var smokeStyle = document.createElement(\"style\");\n    smokeStyle.type = \"text/css\";\n    smokeStyle.appendChild(document.createTextNode(smokeKeyFrames));\n    document.head.appendChild(smokeStyle);\n    var smoke = document.createElement(\"img\");\n    smoke.src = \"./megakeith/smoke\" + (Math.floor(Math.random() * 5) + 1) + \".png\";\n    smoke.style = \"position: absolute; left: \" + Math.random() * window.innerWidth + \"px; animation: Smoke\" + smokeId + \" 3s; opacity: 0; z-index: 50000;\"\n    document.body.appendChild(smoke);\n  }, 100)\n\n  window.setTimeout(function () {\n    if (window.nodeRequire) {\n      var remote = nodeRequire('remote');\n      var win = remote.getCurrentWindow();\n      win.webContents.session.clearCache(function() {\n        location.reload(true);\n      });\n    } else {\n      location.reload(true);\n    }\n  }, 15000)\n}\n</script>";
        return arbiter.publish("messages/send", {
          text: text,
          author: localStorage.displayName
        });
      }
    };
  });

}).call(this);
