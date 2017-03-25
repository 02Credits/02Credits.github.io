define ["mithril"], (m) ->
  position: "before"
  name: "title"
  parent: "text"
  render: (doc, renderBefore, renderInner, renderAfter) ->
    (renderBefore doc).then (beforeChildren) ->
      (renderInner doc).then (innerChildren) ->
        (renderAfter doc).then (afterChildren) ->
          if !doc.author?
            doc.author = "error"
          editIcon = if doc.edited then m "i.material-icons.editIcon", "mode_edit" else null
          [
            beforeChildren
            m "span.card-title", [
              m.trust(doc.author)
              editIcon
              innerChildren
            ]
            afterChildren
          ]
