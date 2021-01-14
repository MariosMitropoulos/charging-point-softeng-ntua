const mongoose = require('mongoose')
const model = require('../models/User')

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
  }
})

const DummyModel = mongoose.model('dummy_Vehicles', VehicleSchema)

const vehiclesModel = require('../models/Vehicle')

module.exports = class Vehicle {
  getVehiclesCount () {
    const len = DummyModel.countDocuments()
    return len
  }

  createDataset (JSONFile) {
    const dataset = require(JSONFile).data
    const res = DummyModel.insertMany(dataset)
    return res
  }

  async createVehicle (count) {
    const vehicles = []

    for (let i = 0; i < count; i++) {
      const v = await DummyModel.findOneAndDelete()
      const w = await vehiclesModel.create({ model: v.model, ac_charger: v.ac_charger, dc_charger: v.dc_charger, brand: v.brand, type: v.type, usable_battery_size: v.usable_battery_size, stations: [] })
      await vehicles.push(w)
    }
    return vehicles
  }

  dropDataset () {
    DummyModel.collection.drop()
  }
}
