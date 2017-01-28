define ["pouchdbManager",
        "moment",
        "arbiter"],
(PouchDB, moment, arbiter) ->
  errorDB = new PouchDB('http://uwhouse.ddns.net:5984/errors')

  console.log "errorLogger initialized"

  window.onerror = (err) ->
    arbiter.publish "error", err

  arbiter.subscribe "error", (information) ->
    info = JSON.stringify information
    console.log info
    errorDB.put
      "_id": moment().utc().valueOf().toString()
      "user": localStorage.displayName
      "information": info
