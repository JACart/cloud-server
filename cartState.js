global.CARTID = require('./connections').cartID
const model = require('./Models/Cart')

let cartstate

global.CARTSTATE = () => cartstate

module.exports.init = async () => {
  cartstate = await model.findById(CARTID)
  if (!cartstate) {
    const newState = {
      _id: CARTID,
      latitude: 0,
      longitude: 0,
      destination: '',
      active: false,
      userId: '',
      state: 'idle',
    }
    cartstate = new model(newState)
    await cartstate.save()
  }
}

module.exports.connect = async (state) => {
  const cartstate = new model(state)
  await model.updateOne({ _id: CARTID }, cartstate)
  emitStateForClient()
}

module.exports.disconnect = async () => {
  cartstate.active = false
  await cartstate.save()
  emitStateForClient()
}

module.exports.reconnect = async () => {
  cartstate.active = true
  await cartstate.save()
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
    cartstate.save()
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
      await cartstate.save()
    }
    emitStateForClient()
    eventManager.emit('summon-cancel')
  }
}

module.exports.summonFinish = async () => {
  cartstate.state = 'summon-finish'
  cartstate.destination = ''
  await cartstate.save()
  emitStateForClient()
}

module.exports.transitStart = async () => {
  cartstate.state = 'transit-start'
  await cartstate.save()
  emitStateForClient()
}

module.exports.transitEnd = async () => {
  cartstate.destination = ''
  cartstate.state = 'transit-end'
  await cartstate.save()
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
  await cartstate.save()
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
