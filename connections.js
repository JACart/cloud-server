
module.exports = {
  mongo:
    'mongodb+srv://mridul:golfcart497@cluster0-nqy0z.mongodb.net/jmu-cloud-server?retryWrites=true&w=majority',
  clientBroadcastEvents: ['cart-status', 'cart-gps', 'cart-speed', 'logs', 'destination', 'cart-active'],
  cartID: 'jakart',
  cartOutgoingEvents: ['summon', 'summon-cancel', 'pullover', 'destination'],
  adminIncomingEvents: ['pullover', 'destination'],
}
