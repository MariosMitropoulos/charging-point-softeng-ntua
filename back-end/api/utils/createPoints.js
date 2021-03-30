const mongoose = require('mongoose')

const pointModel = require('../models/Point')

module.exports = class Points {
  async createPoints (count, stationID) {
    const newPoint = []
    for (let i = 0; i < count; ++i) {
      const newP = await pointModel.create({ station: mongoose.Types.ObjectId(stationID) })
      await newPoint.push(newP)
    }
    return await newPoint
  }
}
