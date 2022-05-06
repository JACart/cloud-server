let cart = { socket: null }
global.CARTGPS = { latitude: 38.433905, longitude: -78.862169 }
global.CARTSPEED = 0

const { cartOutgoingEvents, localIncomingEvents, localOutgoingEvents } = require('./connections')
const cartState = require('./cartState')

// // module.exports.handle = (io) => {
// //   localOutgoingEvents.map((x) => {
// //     eventManager.on(x, (data) => {
// //         io.of('/online').emit(x, data)
// //     })
// // })

//   // io.of('/online').on('connection', socket => {
//     localIncomingEvents.map((x) => {
//         socket.on(x, (data) => eventManager.emit(x, data))
//     })

//     socket.on('cart-connect', async (data) => {
//       cart.socket = socket
//       await cartState.connect(data)
//       eventManager.emit('active-change', true)
//     })

//   // })
// }

module.exports.isConnected = () => {
  if (cart.socket) {
    return cart.socket.connected
  } else {
    return false
  }
}

module.exports.handle = async (nsp) => {
  localOutgoingEvents.map((x) => {
    eventManager.on(x, (data) => {
      nsp.emit(x, data)
    })
  })

  nsp.on('connection', (socket) => {
    console.log('Incoming connection from cart')
    eventManager.emit('cart-connect', true)
    eventManager.emit('cart-active', true)  //App Client

    socket.on('disconnect', () => {
      eventManager.emit('cart-connect', false)
      eventManager.emit('cart-active', false) //App Client
      console.log('Cart Disconnected.')
    })

    localIncomingEvents.map((x) => {
      socket.on(x, (data) => eventManager.emit(x, data))
    })

    socket.on('change-destination', (x) => {
      console.log("Changed Destination: " + x)
    })

    socket.on('change-pullover', (x) => {
      console.log("PULL OVER IS " + x)
    })

    // Temporary fix for client
    socket.on('speed', (x) => {
      eventManager.emit('cart-speed', x)
    })

    
  })

  
}

// module.exports.handle = async (nsp) => {
//   // cartOutgoingEvents.map((x) => {
//   //   eventManager.on(x, (data) => {
//   //     if (cart.socket) cart.socket.emit(x, data)
//   //   })
//   // })
//   localOutgoingEvents.map((x) => {
//     eventManager.on(x, (data) => {
//       nsp.emit(x, data)
//     })
//   })

//   eventManager.on('get-destinations', (x) => {
//     console.log(x)
//   })

//   nsp.on('connection', (socket) => {
//     localIncomingEvents.map((x) => {
//       socket.on(x, (data) => eventManager.emit(x, data))
//     })

//     socket.on('cart-connect', async (data) => {
//       cart.socket = socket
//       await cartState.connect(data)
//       eventManager.emit('active-change', true)
//     })

//     socket.on('summon-finish', () => {
//       cartState.summonFinish()
//     })

//     socket.on('gps', (data) => {
//       CARTGPS.latitude = data.latitude
//       CARTGPS.longitude = data.longitude
//       eventManager.emit('cart-gps', data)
//     })

//     socket.on('speed', (data) => {
//       CARTSPEED = data
//       eventManager.emit('cart-speed', data)
//     })


//     socket.on('logs', (data) => {
//       eventManager.emit('logs', data)
//     })

//     socket.on('destination', (data) => {
//       eventManager.emit('destination-change', data)
//     })

//     socket.on('tts', (data) => {
//       eventManager.emit('tts', data)
//     })

//     socket.on('pullover', (data) => {
//       console.log("cloud receiving pullover :" + data)
//       eventManager.emit('change-pullover', data)
//     })

//     socket.on('path', (data) => {
//       CARTSTATE().path = data
//       eventManager.emit('path', data)
//     })

//     socket.on('cart-active', (data) => {
//       data === true ? cartState.reconnect() : cartState.disconnect()
//     })

//     socket.on('transit-start', (data) => cartState.transitStart(data))

//     socket.on('transit-end', async () => await cartState.transitEnd())

//     socket.on('passenger-exit', async () => await cartState.passengerExit())

//     socket.on(
//       'destination',
//       async (name) => await cartState.setDestination(name)
//     )

//     socket.on('disconnect', async () => {
//       await cartState.disconnect()
//     })
//   })
// }
