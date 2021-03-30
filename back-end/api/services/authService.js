
const user = require('../models/User')
const config = require('config')
const jwt = require('jsonwebtoken')

module.exports = class {
  async verifyUser (req, res, next) {
    try {
      await checkUser(req)
      next()
    } catch (err) {
      // console.log(err)
      res.status(401)
      res.send(err)
      return next('route')
    }
  }

  async verifyAdmin (req, res, next) {
    try {
      await checkUser(req)
      if (req.user.account_type === 'admin') { next() } else { throw new Error('Not authorized') }
    } catch (err) {
      // console.log(err)
      res.status(401)
      res.send(err)
      return next('route')
    }
  }

  async verifyVehicleOwner (req, res, next) {
    try {
      await checkUser(req)
      if (req.user.account_type === 'admin' || req.user.account_type === 'vehicleOwner') { next() } else { throw new Error('Not authorized') }
    } catch (err) {
      // console.log(err)
      res.status(401)
      res.send(err)
      return next('route')
    }
  }

  async verifyStationOwner (req, res, next) {
    try {
      await checkUser(req)
      if (req.user.account_type === 'admin' || req.user.account_type === 'stationOwner') { next() } else { throw new Error('Not authorized') }
    } catch (err) {
      // console.log(err)
      res.status(401)
      res.send(err)
      return next('route')
    }
  }

  async verifyElectricalCompanyOperator (req, res, next) {
    try {
      await checkUser(req)
      if (req.user.account_type === 'admin' || req.user.account_type === 'electricalCompanyOperator') { next() } else { throw new Error('Not authorized') }
    } catch (err) {
      // console.log(err)
      res.status(401)
      res.send(err)
      return next('route')
    }
  }
}

async function checkUser (req) {
  const tokenData = await translateToken(req)
  const userData = await findUserInDB(tokenData._id)

  if (userData.api_key !== tokenData.token) { throw new Error('Not authorized') }
  const parseData = {
    api_key: userData.api_key,
    id: userData._id,
    username: userData.username,
    account_type: userData.account_type
  }
  req.user = parseData
}

async function translateToken (req) {
  const token = req.header('X-OBSERVATORY-AUTH')
  if (!token) throw new Error('No token in header')
  const tokenData = jwt.verify(token, config.TOKEN_SECRET)
  tokenData.token = token
  return tokenData
}

async function findUserInDB (userId) {
  const someUser = user.findById(userId)
  if (someUser === null || someUser === undefined) throw new Error('User not found in DB')
  return someUser
}
