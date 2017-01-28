define ["../emoticons", "arbiter"], (emoticons, arbiter) ->
  (command, args) ->
    if command == "\\emoticons"
      text = ""
      for key of emoticons.ourEmoticons
        emoticon = emoticons.genEmoticon key, false
        text = text + "<p>#{key}: #{emoticon}</p>"
      arbiter.publish "messages/send", { text: text, author: localStorage.displayName }
