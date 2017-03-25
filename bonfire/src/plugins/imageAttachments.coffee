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
          new Promise (resolve, reject) ->
            arbiter.publish "files/fetch", file
            id = arbiter.subscribe "file/data", (fileData) ->
              renderedFiles.push (m "img.materialboxed", {src: URL.createObjectURL(attachment.data)})
              arbiter.unsubscribe id
              resolve()
        Promise.all(thenables).then () ->
          [
            renderedFiles
            children
          ]
      else
        [children]
