requirejs.config
  shim:
    'spellcheck':
      exports: '$Spelling'
    'socketio':
      exports: 'io'
    'deepCopy':
      exports: 'owl'
    'uuid':
      exports: 'uuid'
    'materialize':
      exports: 'Materialize'
      deps: ['jquery', 'hammerjs', 'velocity']
  baseUrl: "bonfire/bin/"
  paths:
    'socketio': '../socket.io/socket.io'
    'hammerjs': 'external/hammer.min'
    'jquery': 'external/jquery.min'
    'SocketIOFileUpload': 'external/siofu.min'
    'materialize': 'external/materialize'
    'moment': 'external/moment.min'
    'mithril': 'external/mithril.min'
    'pouchdb': 'external/pouchdb-5.2.0'
    'pouchdb-collate': 'external/pouchdb-collate'
    'pouchdb-erase': 'external/pouchdb-erase.min'
    'pouchdb-search': 'external/pouchdb.quick-search'
    'pouchdb-upsert': 'external/pouchdb.upsert.min'
    'pouchdb-memory': 'external/pouchdb.memory.min'
    'underscore': 'external/underscore-min'
    'velocity': 'external/velocity.min'
    'arbiter': 'external/promissory-arbiter'
    'es6-promise': 'external/es6-promise.min'
    'dropzone': 'external/dropzone-amd-module'
    'spellcheck': 'external/spellcheck/include'
requirejs [
  'errorLogger'
  'chatCommands'
  'emoticons'
  'plugins'
  'promisePolyfill'
  'socketManager'
  'messageRenderer'
  'messagesManager'
  'scrollManager'
  'uiSetup'
  'inputManager'
  'idleManager'
  'settings'
  'fileManager'
  ],
() ->
  window.baseTitle = "Bonfire"
