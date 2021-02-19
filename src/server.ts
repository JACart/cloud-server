import express, { Request, Response } from 'express'
import { handleCart } from './handleCart'
import { handleAdmin } from './handleAdmin'
import * as http from 'http'

import { handleClient } from './handleClient'
import { EventEmitter } from 'events'

// import { handleCart } from './handleCart'
// import { Server, Socket } from 'socket.io'
// import { createSocket } from 'dgram'

const app = express()
const server = http.createServer(app)

const io = require('socket.io')(server)

export const eventManager: EventEmitter = new EventEmitter()

app.get('/', (req, res) => {
  res.send('hey  hey')
})

//
;(async function init() {
  handleClient(io.of('/client'))
  handleCart(io.of('/cart'))
  handleAdmin(io.of('/admin'))

  server.listen(8020, () => {
    console.log('server started at 8020')
  })
})()
