const { cartOutgoingEvents } = require('./connections')

module.exports = async (nsp) => {
  eventManager.on('log', (data) => {
    nsp.emit('admin_log', data)
  })

  eventManager.on('client-gps', (data) => {
    nsp.emit('client_gps', data)
  })

  eventManager.on('cart-gps', (data) => {
    nsp.emit('cart-gps', data)
  })

  eventManager.on('cart-speed', (data) => {
    nsp.emit('cart-speed', data)
  })

  eventManager.on('destination', (data) => {
    nsp.emit('destination', data)
  })

  eventManager.on('path', (data) => {
    console.log(data)
    nsp.emit('path', data)
  })

  eventManager.on('active-change', (data) => {
    console.log(data)
    nsp.emit('active-change', data)
  })

  eventManager.on('cart-change', (data) => {
    nsp.emit('cart_change', data)
  })

  eventManager.on('state-change', (data) => {
    nsp.emit('state_change', data)
  })

  eventManager.on('logs', (data) => {
    nsp.emit('logs', data)
  })

  eventManager.on('pullover', (data) => {
    nsp.emit('pullover', data)
  })

  nsp.on('connection', (socket) => {
    console.log('incoming connection')

    cartOutgoingEvents.forEach((x) => {
      socket.on(x, (data) => {
        eventManager.emit(x, data)
      })
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
