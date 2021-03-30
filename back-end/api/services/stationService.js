const stationModel = require('../models/Station')
const userModel = require('../models/User')
const Joi = require('joi-oid')
const check = (variable) => {
  return (typeof (variable) !== 'undefined' && variable !== null)
}
module.exports = class {
  async canAccess (userId, stationId) {
    const user = await userModel.findOne({ _id: userId })
    if (!check(user)) return false
    if (user.account_type === 'admin') return true
    if (user.account_type === 'stationOwner' && user.stations.some(station => station.info.toString() === stationId)) return true
    return false
  }

  async add (userId, candidateStation) {
    const schema = Joi.object({
      name: Joi.string().min(1).max(255).required(),
      address: Joi.string().min(1).max(255),
      energy_provider: Joi.objectId().required(),
      contact_info: {
        email: Joi.string().min(5).max(255),
        phone: Joi.string(),
        website: Joi.string().max(2000)
      },
      operator: Joi.string().required()
    })
    schema.validate(candidateStation)

    const res = await stationModel.create(candidateStation)

    await userModel.findByIdAndUpdate(userId,
      { $push: { stations: { name: candidateStation.name, info: res._id } } })

    return (res)
  }

  async edit (stationId, candidateStation) {
    const schema = Joi.object({
      name: Joi.string().min(1).max(255),
      address: Joi.string().min(1).max(255),
      energy_provider: Joi.objectId(),
      contact_info: {
        email: Joi.string().min(5).max(255),
        phone: Joi.string(),
        website: Joi.string().max(2000)
      },
      operator: Joi.string()
    })

    schema.validate(candidateStation)

    await stationModel.findByIdAndUpdate(stationId, candidateStation)
    const res = stationModel.findById(stationId)
    return res
  }

  async delete (userId, stationId) {
    const stationRes = await stationModel.findByIdAndDelete(stationId)
    const userRes = await userModel.findByIdAndUpdate(userId,
      { $pull: { stations: { info: stationId } } })

    if (stationRes && userRes) return true
  }

  async addReview (candidateReview, stationId) {
    const schema = Joi.object({
      date: Joi.date().required(),
      by: Joi.objectId().required(),
      rating: Joi.number().min(1).max(10).required(),
      comment: Joi.string().required()
    })

    const { error, value } = await schema.validate(candidateReview)
    if (error) { throw (error) }

    await stationModel.findByIdAndUpdate(stationId,
      { $push: { reviews: value } })

    const res = stationModel.findById(stationId)

    return res
  }
}
