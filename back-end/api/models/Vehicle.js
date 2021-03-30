const mongoose = require('mongoose')

const VehicleSchema = mongoose.Schema({
  model: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['bev', 'phev']
  },
  usable_battery_size: {
    type: Number,
    required: true
  },
  average_energy_consumption: {
    type: Number
  },
  ac_charger: {
    usable_phases: Number,
    max_power: Number,
    ports: [{ type: String }]
  },
  dc_charger: {
    max_power: Number,
    ports: [{ type: String }]
  },
  sessions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: true
    }
  ]

})

module.exports = mongoose.model('Vehicle', VehicleSchema)
