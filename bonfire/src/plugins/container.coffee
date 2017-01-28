define ["mithril", "arbiter", "linkify"], (m, arbiter, linkify) ->
  name: "container"
  parent: "root"
  render: (doc, renderBefore, renderInner, renderAfter) ->
    if doc.text?
      if Array.isArray(doc.text)
        doc.links = []
        for text in doc.text
          if text.text.indexOf("<") != 0
            for link in linkify.find(text.text)
              doc.links.push(link)
      else if doc.text.indexOf("<") != 0
        doc.links = linkify.find doc.text
    m ".message-container", { key: doc["_id"] },
      m ".message.blue-grey.lighten-5",
      {
        ondblclick: ->
          if not Array.isArray(doc.text)
            arbiter.publish "messages/startEdit", doc._id
      }, [
        renderBefore doc
        m ".message-content.black-text",
          renderInner doc
        renderAfter doc
      ]
