import * as PouchDB from "pouchdb";

var pouchdb = require("pouchdb").default;

pouchdb.plugin(require('pouchdb-quick-search'));
pouchdb.plugin(require('pouchdb-upsert'));

export default pouchdb as PouchDB.Static;
