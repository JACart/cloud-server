global.CARTID = require('./connections').cartID
const model = require('./Models/Cart')

let cartstate = {
  _id: CARTID,
  latitude: 0,
  longitude: 0,
  destination: '',
  active: false,
  userId: '',
  state: 'idle',
}

global.CARTSTATE = () => cartstate

module.exports.connect = async (state) => {
  cartstate = state
  emitStateForClient()
}

module.exports.disconnect = async () => {
  cartstate.active = false
  emitStateForClient()
}

module.exports.reconnect = async () => {
  cartstate.active = true
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
  }
}

module.exports.summonFinish = async () => {
  cartstate.state = 'summon-finish'
  cartstate.destination = ''
  emitStateForClient()
}

module.exports.transitStart = (data) => {
  console.log(data)
  cartstate = data
  emitStateForClient()
}

module.exports.transitEnd = async () => {
  cartstate.destination = ''
  cartstate.state = 'transit-end'
  emitStateForClient()
}

module.exports.passengerExit = async () => {
  cartstate.userId = ''
  cartstate.destination = ''
  cartstate.state = 'idle'
  emitStateForClient()
}

module.exports.setDestination = async (name) => {
  cartstate.destination = name
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
