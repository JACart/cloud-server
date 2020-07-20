let cart = { socket: null, latitude: 38.433769, longitude: -78.862185 }

const { cartOutgoingEvents } = require('./connections')
const cartState = require('./cartState')

module.exports.isConnected = () => {
  if (cart.socket) {
    return cart.socket.connected
  } else {
    return false
  }
}

module.exports.handle = async (nsp) => {
  cartOutgoingEvents.map((x) => {
    eventManager.on(x, (data) => {
      cart.socket?.emit(x, data)
    })
  })

  nsp.on('connection', (socket) => {
    socket.on('cart-connect', async (data) => {
      cart.socket = socket
      await cartState.connect(data)
    })

    socket.on('summon-finish', () => {
      cartState.summonFinish()
    })

    socket.on('cart-active', (data) => {
      data === true ? cartState.reconnect() : cartState.disconnect()
    })

    socket.on('transit-start', async () => await cartState.transitStart())

    socket.on('transit-end', async () => await cartState.transitEnd())

    socket.on('passenger-exit', async () => await cartState.passengerExit())

    socket.on(
      'destination',
      async (name) => await cartState.setDestination(name)
    )

    socket.on('disconnect', async () => {
      await cartState.disconnect()
    })
  })
}
