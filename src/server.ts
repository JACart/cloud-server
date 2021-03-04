import express, { Request, Response } from 'express'
import * as http from 'http'
import { handleAdmin } from './handleAdmin'
import { handleCart } from './handleCart'

import { EventEmitter } from 'events'
import { handleClient } from './handleClient'

// import { handleCart } from './handleCart'
// import { Server, Socket } from 'socket.io'
// import { createSocket } from 'dgram'

const app = express()
const server = http.createServer(app)

const io = require('socket.io')(server)

export const eventManager: EventEmitter = new EventEmitter()

app.get('/', (req, res) => {
  res.send('shorturl.at/hqCK0')
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
