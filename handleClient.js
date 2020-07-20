const { clientOutgoingEvents, clientBroadcastEvents } = require('./connections')

const cartState = require('./cartState')

const clients = {}

module.exports = async (nsp) => {
  clientBroadcastEvents.map((x) => {
    eventManager.on(x, (data) => nsp.emit(x, data))
  })
  nsp.on('connection', (socket) => {
    socket.emit('success')
    socket.on('client-id', async (data) => {
      const json = JSON.parse(data)

      clients[json.id] = {
        socket: socket,
        latitude: data.latitude,
        longitude: data.longitude,
      }

      socket.emit(
        'cart-status',
        JSON.stringify({
          active: CARTSTATE().active,
          userId: CARTSTATE().userId,
          status: CARTSTATE().status,
          destination: CARTSTATE().destination,
        })
      )
    })

    socket.on('summon', async (data) => {
      await cartState.summon(JSON.parse(data), socket)
    })

    socket.on('cancel', async (id) => {
      await cartState.cancelSummon(id, socket)
    })

    socket.on('gps', (data) => {
      const json = JSON.parse(data)
      if (client[json.id]) {
        client[json.id].latitude = json.latitude
        client[json.id].longitude = json.longitude
      }
      eventManager.emit('client-gps', JSON.parse(data))
    })

    socket.on('disconnect', (cartId) => {
      for (const key in clients) {
        if (clients.hasOwnProperty(key)) {
          const element = clients[key].socket
          if (!element.connected) {
            delete clients[key]
          }
        }
      }
      eventManager.emit('client-change', Object.keys(clients))
    })
  })
}
