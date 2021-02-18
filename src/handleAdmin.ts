import { Socket } from 'socket.io'
import { CARTSTATE, CartState } from './cartState'
import { CARTGPS } from './handleCart'
import { eventManager } from './server'

export let handleAdmin = async (nsp: any) => {
  eventManager.on('log', (data: string) => {
    nsp.emit('admin_log', data)
  })

  eventManager.on('client-gps', (data: CartState) => {
    nsp.emit('client_gps', data)
  })

  eventManager.on('cart-gps', (data: CartState) => {
    nsp.emit('cart_gps', data)
  })

  eventManager.on('path', (data: string) => {
    console.log(data)
    nsp.emit('path', data)
  })

  eventManager.on('cart-change', (data: string) => {
    nsp.emit('cart_change', data)
  })

  eventManager.on('state-change', (data: string) => {
    nsp.emit('state_change', data)
  })

  nsp.on('connection', (socket: Socket) => {
    socket.on('get', () => {
      socket.emit('cart_change', CARTSTATE().active ? 1 : 0)
      socket.emit('path', CARTSTATE().path ? CARTSTATE().path : [])
      socket.emit('cart_gps', {
        lat: CARTGPS.latitude,
        lng: CARTGPS.longitude,
      })
      socket.emit(
        'state_change',
        CARTSTATE().active ? CARTSTATE().state : 'offline'
      )
    })
  })
}
