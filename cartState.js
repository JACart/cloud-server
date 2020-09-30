global.CARTID = require('./connections').cartID
const { json } = require('express')
const model = require('./Models/Cart')

let cartstate = {
  _id: CARTID,
  latitude: 0,
  longitude: 0,
  destination: '',
  active: false,
  userId: '',
  state: 'idle',
  path: [],
}

global.CARTSTATE = () => cartstate

module.exports.connect = async (state) => {
  cartstate = state

  eventManager.emit('log', { type: 'cart-connect', msg: '{}' })
  eventManager.emit('cart-change', 1)
  eventManager.emit('state-change', cartstate.state)

  emitStateForClient()
}

module.exports.disconnect = async () => {
  cartstate.active = false
  eventManager.emit('log', { type: 'cart-disconnect', msg: '{}' })
  eventManager.emit('cart-change', 0)
  eventManager.emit('state-change', cartstate.state)

  emitStateForClient()
}

module.exports.reconnect = async () => {
  cartstate.active = true
  eventManager.emit('log', { type: 'cart-reconnect', msg: '{}' })
  eventManager.emit('cart-change', 1)
  eventManager.emit('state-change', cartstate.state)

  emitStateForClient()
}

module.exports.summon = async (data, socket) => {
  if (!cartstate.active) {
    emitStateForClient()
  } else if (cartstate.userId !== '') {
    emitStateForClient()
  } else {
    cartstate.userId = data.id
    cartstate.latitude = data.latitude
    cartstate.longitude = data.longitude
    cartstate.state = 'summon-start'
    emitStateForClient()
    eventManager.emit('summon', {
      id: data.id,
      latitude: data.latitude,
      longitude: data.longitude,
    })
  }
  eventManager.emit('state-change', cartstate.state)

  eventManager.emit('log', {
    type: 'cart-state',
    msg: JSON.stringify(cartstate),
  })
}

module.exports.cancelSummon = async (id, socket) => {
  if (!cartstate.active) {
    emitStateForClient()
  } else {
    if (cartstate.userId === id) {
      cartstate.userId = ''
      cartstate.latitude = 0
      cartstate.longitude = 0
      cartstate.destination = ''
      cartstate.state = 'idle'
    }
    emitStateForClient()
    eventManager.emit('summon-cancel')
    eventManager.emit('state-change', cartstate.state)
  }
}

module.exports.summonFinish = async () => {
  cartstate.state = 'summon-finish'
  cartstate.destination = ''
  emitStateForClient()
  eventManager.emit('log', {
    type: 'summon-finish',
    msg: JSON.stringify(cartstate),
  })
  eventManager.emit('state-change', cartstate.state)
}

module.exports.transitStart = (data) => {
  console.log(data)
  cartstate = data
  emitStateForClient()
  eventManager.emit('state-change', cartstate.state)
  eventManager.emit('log', {
    type: 'transit-start',
    msg: JSON.stringify(cartstate),
  })
}

module.exports.transitEnd = async () => {
  cartstate.destination = ''
  cartstate.state = 'transit-end'
  emitStateForClient()
  eventManager.emit('log', {
    type: 'transit-end',
    msg: JSON.stringify(cartstate),
  })
  eventManager.emit('state-change', cartstate.state)
}

module.exports.passengerExit = async () => {
  cartstate.userId = ''
  cartstate.destination = ''
  cartstate.state = 'idle'
  emitStateForClient()
  eventManager.emit('log', {
    type: 'passenger-exit',
    msg: JSON.stringify(cartstate),
  })
  eventManager.emit('state-change', cartstate.state)
  eventManager.emit('log', { type: 'passenger-exit', msg: '{}' })
}

module.exports.setDestination = async (name) => {
  cartstate.destination = name
  eventManager.emit('log', { type: 'set-destination', msg: name })
}

function emitStateForClient() {
  eventManager.emit(
    'cart-status',
    JSON.stringify({
      userId: cartstate.userId,
      destination: cartstate.destination,
      state: cartstate.state,
      active: cartstate.active,
    })
  )
}
