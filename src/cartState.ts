import { eventManager } from './server'
import { json } from 'express'
import { CARTID } from './connections'

export enum states {
  IDLE,
  SUMMON,
  SUMMON_CANCEL,
  SUMMON_START,
  SUMMON_FINISH,
  TRANSIT_END,
}
export interface CartState {
  _id: string
  latitude: number
  longitude: number
  destination: string
  active: boolean
  userId: string
  state: states
  path: any
}

export let cartState: CartState = {
  _id: CARTID,
  latitude: 0,
  longitude: 0,
  destination: '',
  active: false,
  userId: '',
  state: states.IDLE,
  path: [],
}

export const CARTSTATE = (): CartState => cartState

export const connect = async (state: CartState) => {
  cartState = state
  eventManager.emit('log', { type: 'cart-connect', msg: '{}' })
  eventManager.emit('cart-change', 1)
  eventManager.emit('state-change', cartState.state)

  emitStateForClient()
}

export const disconnect = async () => {
  cartState.active = false
  eventManager.emit('log', { type: 'cart-disconnect', msg: '{}' })
  eventManager.emit('cart-change', 0)
  eventManager.emit('state-change', cartState.state)

  emitStateForClient()
}

export const reconnect = async () => {
  cartState.active = true
  eventManager.emit('log', { type: 'cart-reconnect', msg: '{}' })
  eventManager.emit('cart-change', 1)
  eventManager.emit('state-change', cartState.state)

  emitStateForClient()
}

export const summon = async (data: CartState, socket: any) => {
  if (!cartState.active) {
    emitStateForClient()
  } else if (cartState.userId !== '') {
    emitStateForClient()
  } else {
    cartState.userId = data._id
    cartState.latitude = data.latitude
    cartState.longitude = data.longitude
    cartState.state = states.SUMMON_START
    emitStateForClient()
    eventManager.emit('summon', {
      id: data._id,
      latitude: data.latitude,
      longitude: data.longitude,
    })
  }
  eventManager.emit('state-change', cartState.state)

  eventManager.emit('log', {
    type: 'cart-state',
    msg: JSON.stringify(cartState),
  })
}

export const cancelSummon = async (id: String, socket: any) => {
  if (!cartState.active) {
    emitStateForClient()
  } else {
    if (cartState.userId === id) {
      cartState.userId = ''
      cartState.latitude = 0
      cartState.longitude = 0
      cartState.destination = ''
      cartState.state = states.IDLE
    }
    emitStateForClient()
    eventManager.emit('summon-cancel')
    eventManager.emit('state-change', cartState.state)
  }
}

export const summonFinish = async () => {
  cartState.state = states.SUMMON_FINISH
  cartState.destination = ''
  emitStateForClient()
  eventManager.emit('log', {
    type: 'summon-finish',
    msg: JSON.stringify(cartState),
  })
  eventManager.emit('state-change', cartState.state)
}

export const transitStart = (data: CartState) => {
  console.log(data)
  cartState = data
  emitStateForClient()
  eventManager.emit('state-change', cartState.state)
  eventManager.emit('log', {
    type: 'transit-start',
    msg: JSON.stringify(cartState),
  })
}

export const transitEnd = async () => {
  cartState.destination = ''
  cartState.state = states.TRANSIT_END
  emitStateForClient()
  eventManager.emit('log', {
    type: 'transit-end',
    msg: JSON.stringify(cartState),
  })

  eventManager.emit('state-change', cartState.state)
}

export const passengerExit = async () => {
  cartState.userId = ''
  cartState.destination = ''
  cartState.state = states.IDLE
  emitStateForClient()
  eventManager.emit('log', {
    type: 'passenger-exit',
    msg: JSON.stringify(cartState),
  })
  eventManager.emit('state-change', cartState.state)
  eventManager.emit('log', { type: 'passenger-exit', msg: '{}' })
}

export const setDestination = async (name: string) => {
  cartState.destination = name
  eventManager.emit('log', { type: 'set-destination', msg: name })
}

function emitStateForClient() {
  eventManager.emit(
    'cart-status',
    JSON.stringify({
      userId: cartState.userId,
      destination: cartState.destination,
      state: cartState.state,
      active: cartState.active,
    })
  )
}
