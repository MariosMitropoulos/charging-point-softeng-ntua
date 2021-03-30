const stationModel = require('../models/Station')
const userModel = require('../models/User')
const pointModel = require('../models/Point')

const check = (variable) => {
  return (typeof (variable) !== 'undefined' && variable !== null)
}

module.exports = class {
  async canAccess (req, pointId) {
    const userData = req.user
    const user = await userModel.findOne({ _id: userData.id })
    const point = await pointModel.findById(pointId)
    if (!check(user)) return false
    if (user.account_type === 'admin') return true
    if (user.account_type === 'stationOwner' && user.stations.some(station => station.info === point.station)) return true
    return false
  }

  async get (pointId) {
    const point = await pointModel.findById(pointId)
    return point
  }

  async add (stationId) {
    const station = stationModel.findById(stationId)
    if (!check(station)) throw new Error('Station not in DB')

    const res = await pointModel.create({ station: stationId, total_energy_delivered: 0 })

    await stationModel.findByIdAndUpdate(stationId,
      { $push: { points: res._id } })

    return res
  }

  async remove (pointId) {
    const pointRes = await pointModel.findByIdAndDelete(pointId)
    const stationRes = await stationModel.findByIdAndUpdate(pointRes.station,
      { $pull: { points: pointRes._id } })
    if (stationRes && pointRes) { return true } else { return false }
  }
}
