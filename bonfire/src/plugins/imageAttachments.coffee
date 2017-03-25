define ["mithril", "arbiter", "pouchdbManager"], (m, arbiter, PouchDB) ->
  db = new PouchDB('http://uwhouse.ddns.net:5984/attachments')
  name: "imageAttachments"
  parent: "images"
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
              if attachment.content_type.startsWith("image")
                renderedFiles.push (m "img", {src: URL.createObjectURL(attachment.data)})
        Promise.all(thenables).then () ->
          [
            renderedFiles
            children
          ]
      else
        [children]
