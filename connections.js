module.exports = {
  mongo:
    'mongodb+srv://mridul:golfcart497@cluster0-nqy0z.mongodb.net/jmu-cloud-server?retryWrites=true&w=majority',
  clientBroadcastEvents: ['cart-status', 'cart-gps', 'cart-speed'],
  cartID: 'jakart',
  cartOutgoingEvents: ['summon', 'summon-cancel', 'pullover'],
  adminIncomingEvents: ['pullover'],
}
