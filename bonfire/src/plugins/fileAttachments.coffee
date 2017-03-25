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
          new Promise (resolve, reject) ->
            arbiter.publish "files/fetch", file
            id = arbiter.subscribe "file/data", (fileData) ->
              renderedFiles.push (m "p", (m "a", {href: URL.createObjectURL(fileData.attachment.data), download: name}, [
                  name
                ]))
              arbiter.unsubscribe id
              resolve()
        Promise.all(thenables).then () ->
          [
            renderedFiles
            children
          ]
      else
        [children]
