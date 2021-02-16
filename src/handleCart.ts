import {
  CARTSTATE,
  CartState,
  connect,
  disconnect,
  passengerExit,
  reconnect,
  setDestination,
  summonFinish,
  transitEnd,
  transitStart,
} from './cartState'
import { eventManager } from './server'

let cart = { socket: null }

export interface cartGPS {
  latitude: number
  longitude: number
}

export let CARTGPS: cartGPS = { latitude: 38.433905, longitude: -78.862169 }

// import { cartOutgoingEvents } from './connections'
const cartOutgoingEvents = []
import { isVariableStatement } from 'typescript'
// const { cartOutgoingEvents } = require('./connections')

export var isConnected = () => {
  if (cart.socket) {
    return cart.socket.connected
  } else {
    return false
  }
}

export var handleCart = async (nsp: any) => {
  cartOutgoingEvents.map((x: any) => {
    eventManager.on(x, (data: CartState) => {
      if (cart.socket) cart.socket.emit(x, data)
    })
  })

  nsp.on('connection', (socket: any) => {
    socket.on('cart-connect', async (data: CartState) => {
      cart.socket = socket
      await connect(data)
    })

    socket.on('summon-finish', () => {
      summonFinish()
    })

    socket.on('gps', (data: CartState) => {
      CARTGPS.latitude = data.latitude
      CARTGPS.longitude = data.longitude
      eventManager.emit('cart-gps', data)
    })

    socket.on('path', (data: string) => {
      CARTSTATE().path = data
      eventManager.emit('path', data)
    })

    socket.on('cart-active', (data: boolean) => {
      data === true ? reconnect() : disconnect()
    })

    socket.on('transit-start', (data: CartState) => transitStart(data))

    socket.on('transit-end', async () => await transitEnd())

    socket.on('passenger-exit', async () => await passengerExit())

    socket.on('destination', async (name: string) => await setDestination(name))

    socket.on('disconnect', async () => {
      await disconnect()
    })
  })
}
