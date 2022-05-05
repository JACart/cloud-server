
module.exports = {
  mongo:
    'mongodb+srv://mridul:golfcart497@cluster0-nqy0z.mongodb.net/jmu-cloud-server?retryWrites=true&w=majority',
  clientBroadcastEvents: ['cart-status', 'cart-gps', 'cart-speed', 'logs', 'destination', 'cart-active'],
  cartID: 'jakart',

  localOutgoingEvents: [
    'tts', 
    'destination', 
    'pullover',
  ],
  localIncomingEvents: [
    'transcript',
    'get-destinations',
    'gps',
    'path',
    'logs',
    'mph',
    'connect',
    'summon-cancel',
    'summon-finish',
    'change-pullover',
    'change-destination',
  ],
  adminIncomingEvents: [
    'tts', 
    'destination', 
    'pullover',
  ],
  adminOutgoingEvents: [
    'transcript',
    'get-destinations',
    'gps',
    'path',
    'logs',
    'mph',
    'cart-connect',
    'summon-cancel',
    'summon-finish',
    'change-pullover',
    'change-destination',
  ],
}
