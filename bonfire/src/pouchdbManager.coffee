define [
  "pouchdb",
  "pouchdb-search",
  "pouchdb-upsert"],
(PouchDB, search, upsert) ->
  PouchDB.plugin search
  PouchDB.plugin upsert
  PouchDB
