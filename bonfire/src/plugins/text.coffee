define ["mithril", "arbiter", "linkify-string", "emoticons"], (m, arbiter, linkify, emoticons) ->
  renderText = (text, author, id) ->
    classText = if text.indexOf(">") == 0 then ".greentext" else ""
    if text.indexOf("<") != 0
      text = linkify("#{text}")
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
    if !doc.text?
      renderText("error", doc._id)
    else if Array.isArray(doc.text)
      elements = [renderBefore doc]
      for text in doc.text
        elements.push(renderText(text.text, doc.author, text.id))
      elements.push(renderAfter doc)
      elements
    else
      [
          renderBefore doc
          renderText(doc.text, doc.author, doc._id)
          renderAfter doc
      ]
