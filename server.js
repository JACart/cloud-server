const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const handleClient = require('./handleClient')
const handleCart = require('./handleCart')
const handleAdmin = require('./handleAdmin')

const events = require('events').EventEmitter
global.eventManager = new events()

//
;(async function init() {
  handleClient(io.of('/client'))
  handleCart.handle(io.of('/cart'))
  handleAdmin(io.of('/admin'))

  server.listen(10000, () => {
    console.log('server started at 10000')
  })
})()
