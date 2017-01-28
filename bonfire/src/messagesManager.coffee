define ["jquery",
        "underscore",
        "pouchdbManager",
        "mithril",
        "moment",
        "pouchdb-collate",
        "messageRenderer",
        "inputManager",
        "arbiter",
        "scrollManager"],
($, _, PouchDB, m, moment, collate, messageRenderer, inputManager, arbiter, scrollManager) ->
  remoteDB = new PouchDB('http://uwhouse.ddns.net:5984/messages')
  localDB = new PouchDB('messages')

  currentServer = remoteDB;

  handleChange = (change) ->
    render()
    if change.doc.author != localStorage.displayName
      if notifier?
        notifier.notify true

  render = () ->
    if !inputManager.searching
      currentServer.allDocs
        include_docs: true
        conflicts: false
        attachments: true
        binary: true
        limit: scrollManager.messages
        descending: true
        startkey: "_design"
      .then (results) ->
        renderMessages(results.rows.reverse())
      .catch (err) ->
        arbiter.publish "error", err

  renderMessages = (messages) ->
    messages = _.filter(messages, (message) ->
      doc = message.doc
      doc.text? and
      doc.author?
    )
    groupedMessages = []
    currentAuthor = {}
    currentMessage = null
    for message in messages
      if message.doc.text.startsWith("<")
        if currentMessage?
          groupedMessages.push(currentMessage)
          currentMessage = null
        groupedMessages.push(message)
      else
        if currentMessage?
          if currentMessage.doc.author == message.doc.author and
             moment.utc(message.doc.time).diff(moment.utc(currentMessage.doc.time), 'minutes') < 2
            if message.doc.edited
              currentMessage.doc.edited = true
            currentMessage.doc.time = message.doc.time
            currentMessage.doc.text.push {text: message.doc.text, id: message.doc._id}
          else
            groupedMessages.push(currentMessage)
            currentMessage = message
            message.doc.text = [{text: message.doc.text, id: message.doc._id}]
        else
          currentMessage = message
          message.doc.text = [{text: message.doc.text, id: message.doc._id}]
    if currentMessage?
      groupedMessages.push(currentMessage)

    m.render $('#messages').get(0),
      m "div",
        for message in groupedMessages
          doc = message.doc
          messageRenderer.render(doc)
    arbiter.publish("messages/rendered")

  remoteChanges = remoteDB.changes
    since: 'now'
    live: true
    include_docs: true
  .on 'change', handleChange
  .on 'error', (err) ->
    arbiter.publish "error", err

  localDB.sync(remoteDB)
  .then () ->
    $('.progress').fadeOut()
    localDB.changes
      since: 'now'
      live: true
      include_docs: true
    .on 'change', handleChange
    .on 'error', (err) ->
      arbiter.publish "error", err
    remoteChanges.cancel()
    currentServer = localDB;
  .catch (err) ->
    arbiter.publish "error", err

  render()
  $('#input').prop('disabled', false)

  arbiter.subscribe "messages/render", (messages) ->
    if !messages?
      render()
    else
      renderMessages messages

  arbiter.subscribe "messages/edit", (args) ->
    id = args.id
    text = args.text
    currentServer.get(id)
    .then (doc) ->
      doc.text = text
      doc.edited = true
      currentServer.put doc
    .catch (err) ->
      arbiter.publish "error", err

  arbiter.subscribe "messages/search", (query) ->
    currentServer.search
      query: query
      fields: ['author', 'text']
      include_docs: true
    .then (results) ->
      renderMessages(results.rows.reverse())

  arbiter.subscribe "messages/send", (args) ->
    text = args.text
    author = args.author
    if text? and author?
      currentServer.allDocs
        include_docs: true
        conflicts: false
        limit: 1
        descending: true
        startkey: "_design"
      .then (results) ->
        doc = results.rows[0].doc
        now = moment().utc()
        time = now.valueOf()
        messageNumber = (parseInt(doc.messageNumber) + 1).toString()
        idNumber = parseInt(messageNumber.toString() + time.toString())
        id = collate.toIndexableString(idNumber).replace(/\u0000/g, '\u0001');
        currentServer.put
          "_id": id
          "messageNumber": messageNumber
          "time": time
          "author": author
          "text": text
      .catch (err) ->
        arbiter.publish "error", err

  arbiter.subscribe "messages/getLast", (callback) ->
    currentServer.query "by_author",
      key: localStorage.displayName;
      limit: 1
      include_docs: true
      descending: true
    .then (result) ->
      callback result.rows[0].doc
    .catch (err) ->
      arbiter.publish "error", err

  arbiter.subscribe "messages/get", (args) ->
    id = args.id
    callback = args.callback
    currentServer.get(id)
    .then (doc) ->
      callback doc
    .catch (err) ->
      arbiter.publish "error", err
