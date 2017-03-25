define ["mithril", "arbiter", "pouchdbManager"], (m, arbiter, PouchDB) ->
  db = new PouchDB('http://uwhouse.ddns.net:5984/attachments')
  name: "fileAttachments"
  parent: "text"
  position: "after"
  render: (doc, renderChildren) ->
    (renderChildren doc).then (children) ->
      if doc.file? or doc.files?
        if (doc.file)
          doc.files = [doc.file]
        renderedFiles = []
        thenables = for file in doc.files
          db.get(file, {attachments: true, binary: true})
          .then (doc) ->
            for name, attachment of doc["_attachments"]
              renderedFiles.push (m "p", (m "a", {href: URL.createObjectURL(attachment.data), download: name}, [
                  name
                ]))
        Promise.all(thenables).then () ->
          [
            renderedFiles
            children
          ]
      else
        [children]
