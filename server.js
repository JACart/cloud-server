const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const mongoose = require('mongoose')
const handleClient = require('./handleClient')
const handleCart = require('./handleCart')
const handleAdmin = require('./handleAdmin')
const cartState = require('./cartState')
const model = require('./Models/Cart')

const events = require('events').EventEmitter
global.eventManager = new events()

//
;(async function init() {
  await mongoose.connect(require('./connections').mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })

  await cartState.init()
  handleClient(io.of('/client'))
  handleCart.handle(io.of('/cart'))
  // handleAdmin(io.of('/admin'))

  console.log('connected to mongodb')

  server.listen(8020, () => {
    console.log('server started at 8020')
  })
})()
