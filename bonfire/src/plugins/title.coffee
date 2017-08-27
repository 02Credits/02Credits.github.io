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
          titleClass = if doc.fb then ".card-title.fb-card-title" else ".card-title"
          editIcon = if doc.edited then m "i.material-icons.editIcon", "mode_edit" else null
          [
            beforeChildren
            m "span" + titleClass, [
              m.trust(doc.author)
              editIcon
              innerChildren
            ]
            afterChildren
          ]
