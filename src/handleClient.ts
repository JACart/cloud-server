import { Socket } from 'dgram'
import { cancelSummon, CartState, cartState, summon } from './cartState'
import { clientBroadcastEvents } from './connections'
import { eventManager } from './server'

const clients = {}

export let handleClient = async (nsp: Socket) => {
  clientBroadcastEvents.map((x: string) => {
    eventManager.on(x, (data: CartState) => nsp.emit(x, data))
  })
  nsp.on('connection', (socket: any) => {
    socket.emit('success')
    socket.on('client-id', async (data: any) => {
      const json = JSON.parse(data)
      clients[json.id] = {
        latitude: data.latitude,
        longitude: data.longitude,
        socket,
      }

      eventManager.emit('log', { type: 'client-connected', msg: data })
      socket.emit(
        'cart-status',
        JSON.stringify({
          active: cartState.active,
          destination: cartState.destination,
          status: cartState.state,
          userId: cartState.userId,
        })
      )
    })

    socket.on('summon', async (data: string) => {
      await summon(JSON.parse(data), socket)
      eventManager.emit('log', { type: 'summon', msg: data })
    })

    socket.on('cancel', async (id: string) => {
      await cancelSummon(id, socket)
      eventManager.emit('log', { type: 'summon-cancel', msg: id })
    })

    socket.on('gps', (data: string) => {
      const json = JSON.parse(data)
      if (clients[json.id]) {
        clients[json.id].latitude = json.latitude
        clients[json.id].longitude = json.longitude
      }
      eventManager.emit('client-gps', JSON.parse(data))
    })

    socket.on('disconnect', (cartId: string) => {
      for (const key in clients) {
        if (clients.hasOwnProperty(key)) {
          const element = clients[key].socket
          if (!element.connected) {
            delete clients[key]
          }
        }
      }
      eventManager.emit('log', { type: 'client-disconnected', msg: cartId })
      eventManager.emit('client-change', Object.keys(clients))
    })
  })
}
