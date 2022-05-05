const { adminIncomingEvents, adminOutgoingEvents } = require('./connections')

module.exports = async (nsp) => {

  adminOutgoingEvents.map((x) => {
    eventManager.on(x, (data) => {
      nsp.emit(x, data)
    })
  })

  eventManager.on('get-destinations', (data) => {
    nsp.emit('get-destinations', (data))
  })

  nsp.on('connection', (socket) => {
    console.log('Incoming connection from admin')

    adminIncomingEvents.map((x) => {
      socket.on(x, (data) => eventManager.emit(x, data))
    })
    // cartOutgoingEvents.forEach((x) => {
    //   socket.on(x, (data) => {
    //     eventManager.emit(x, data)
    //   })
    // })
    // cartOutgoingEvents.map((x) => {
    //   socket.on(x, (data) => eventManager.emit(x, data))
    // })

    socket.on('tts', (data) => {
      console.log("TTS: " + data)
    })

    socket.on('get', () => {
      socket.emit('cart_change', CARTSTATE().active ? 1 : 0)
      socket.emit('path', CARTSTATE().path ? CARTSTATE().path : [])
      socket.emit('cart_gps', {
        lat: CARTGPS.latitude,
        lng: CARTGPS.longitude,
      })
      console.log(CARTSTATE().active)
      socket.emit(
        'active-change',
        CARTSTATE().active ? CARTSTATE().state : 'offline'
      )
    })
  })
}
