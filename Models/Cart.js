const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
  _id: String,
  destination: { type: String, default: '' },
  latitude: { type: Number, default: 0 },
  longitude: { type: Number, default: 0 },
  state: { type: String, default: 'idle' }, //idle summon-start summon-finish transit-start transit-end
  userId: { type: String, default: '' },
  active: { type: Boolean, default: false },
})

module.exports = mongoose.model('cart', cartSchema)
