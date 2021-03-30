const Session = require('../models/Session')
const Vehicle = require('../models/Vehicle')
const Point = require('../models/Point')
const User = require('../models/User')
const config = require('config')
const UserService = require('./userService')
const userService = new UserService()
const resetSessions = async (req, res, next) => {
  const areSessionsDeleted = await deleteAllSessions()
  if (areSessionsDeleted === false) {
    res.send({ status: 'failed' })
  }
  try {
    await userService.createUserF({ username: config.DEFAULT_USER_NAME, password: config.DEFAULT_USER_PASSWORD, account_type: 'admin' })
  } catch (err) {
    res.send({ status: 'failed' })
  }
  res.send({ status: 'OK' })
}

const deleteAllSessions = async () => {
  const deleteSessionRes = await Session.deleteMany()
  const deleteSessionInVehivleRes = await Vehicle.updateMany({}, { sessions: [] })
  const deleteSessionInPointRes = await Point.updateMany({}, { sessions: [] })
  const deleteSessionInUserRes = await User.updateMany({}, { electricalCompanyOperatorSessions: [] })
  if (deleteSessionRes && deleteSessionInVehivleRes && deleteSessionInPointRes && deleteSessionInUserRes) return true
  else return false
}

module.exports = resetSessions
