define ["mithril", "arbiter", "linkify-string", "emoticons"], (m, arbiter, linkify, emoticons) ->
  renderText = (text, author, id) ->
    classText = if text.indexOf(">") == 0 then ".greentext" else ""
    if text.indexOf("<") != 0
      text = linkify "#{text}",
        format: (value, type) ->
          if (type == 'url' && value.length > 50)
            value = value.slice(0, 50) + '…';
          return value
      if emoticons.singleEmoticon(text)
        return m ".emoticon", {
          style: {width: "100%", textAlign: "center"}
          ondblclick: -> arbiter.publish "messages/startEdit", id
        }, m.trust(emoticons.replace(text, id, author, true))
      else
        text = emoticons.replace(text, id, author, false)
    m "p#{classText}", {
          ondblclick: -> arbiter.publish "messages/startEdit", id
      }, m.trust(text)

  name: "text"
  parent: "container"
  render: (doc, renderBefore, renderAfter) ->
    (renderBefore doc).then (beforeChildren) ->
      (renderAfter doc).then (afterChildren) ->
        if doc.text?
          if Array.isArray(doc.text)
            elements = [beforeChildren]
            for text in doc.text
              elements.push(renderText(text.text, doc.author, text.id))
            elements.push(afterChildren)
            elements
          else
            [
              beforeChildren
              renderText(doc.text, doc.author, doc._id)
              afterChildren
            ]
        else
          [
            beforeChildren
            afterChildren
          ]
