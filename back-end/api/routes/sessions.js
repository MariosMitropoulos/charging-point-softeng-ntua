const express = require('express')
const router = express.Router()
const SessionService = require('../services/sessionService')

const myService = new SessionService()

const AuthService = require('../services/authService')
const authService = new AuthService()

const csvjson = require('../services/JSONToCSV')

router.get('/SessionsPerPoint/:pointID/:yyyymmdd_from/:yyyymmdd_to/:format?', authService.verifyStationOwner, async (req, res, next) => {
  try {
    const pointId = req.params.pointID
    const startDate = req.params.yyyymmdd_from
    const endDate = req.params.yyyymmdd_to

    const result = await myService.getSessionsPerPoint(pointId, startDate, endDate)

    res.locals.data = result
    return next()
  } catch (err) {
    res.sendStatus(400)
    console.log(err)
  }
}, csvjson)

router.get('/SessionsPerStation/:stationID/:yyyymmdd_from/:yyyymmdd_to/:format?', authService.verifyStationOwner, async (req, res, next) => {
  try {
    const stationId = req.params.stationID
    const startDate = req.params.yyyymmdd_from
    const endDate = req.params.yyyymmdd_to

    const result = await myService.getSessionsPerStation(stationId, startDate, endDate)
    res.locals.data = result
    return next()
  } catch (err) {
    res.sendStatus(400)
    console.log(err)
  }
}, csvjson)

router.get('/SessionsPerEV/:vehicleID/:yyyymmdd_from/:yyyymmdd_to/:format?', authService.verifyUser, async (req, res, next) => {
  try {
    const vehicleId = req.params.vehicleID
    const startDate = req.params.yyyymmdd_from
    const endDate = req.params.yyyymmdd_to

    const result = await myService.getSessionsPerEV(vehicleId, startDate, endDate)
    res.locals.data = result
    return next()
  } catch (err) {
    res.sendStatus(400)
    console.log(err)
  }
}, csvjson)

router.get('/SessionsPerProvider/:providerID/:yyyymmdd_from/:yyyymmdd_to/:format?', authService.verifyElectricalCompanyOperator, async (req, res, next) => {
  try {
    const providerId = req.params.providerID
    const startDate = req.params.yyyymmdd_from
    const endDate = req.params.yyyymmdd_to

    const result = await myService.getSessionsPerProvider(providerId, startDate, endDate)
    res.locals.data = result
    return next()
  } catch (err) {
    res.sendStatus(400)
    console.log(err)
  }
}, csvjson)

router.get('/KilometersDriven/:vehicleID/:Session1ID/:Session2ID/:format?', authService.verifyUser, async (req, res, next) => {
  try {
    const car = req.params.vehicleID
    const session1 = req.params.Session1ID
    const session2 = req.params.Session2ID

    const result = await myService.getKilometers(car, session1, session2)
    res.locals.data = { result }
    return next()
  } catch (err) {
    res.status(400).send('Invalid Input')
    console.log(err)
  }
}, csvjson)

router.get('/PeriodicBill/:vehicleID/:yyyymmdd_from/:yyyymmdd_to/:format?', authService.verifyUser, async (req, res, next) => {
  try {
    const vehicleId = req.params.vehicleID
    const startDate = req.params.yyyymmdd_from
    const endDate = req.params.yyyymmdd_to

    const result = await myService.getBill(vehicleId, startDate, endDate)
    res.locals.data = { result }
    return next()
  } catch (err) {
    res.status(400).send('Invalid Input')
    console.log(err)
  }
}, csvjson)

router.get('/EstimatedTimeAndCost/:vehicleID/:current_capacity/:mode/:format?', authService.verifyUser, async (req, res, next) => {
  try {
    const vehicleId = req.params.vehicleID
    const currentCapacity = req.params.current_capacity
    const chargeMode = req.params.mode

    const result = await myService.getEstimatedTimeAndCost(vehicleId, currentCapacity, chargeMode)
    res.locals.data = result
    return next()
  } catch (err) {
    res.status(400).send('Invalid Input')
    console.log(err)
  }
}, csvjson)

router.get('/ChargingPercentage/:vehicleID/:current_capacity/:format?', authService.verifyUser, async (req, res, next) => {
  try {
    const vehicleId = req.params.vehicleID
    const currentCapacity = req.params.current_capacity

    const result = await myService.getChargingPercentage(vehicleId, currentCapacity)
    res.locals.data = result
    return next()
  } catch (err) {
    res.status(400).send('Invalid Input')
    console.log(err)
  }
}, csvjson)

router.get('/CostPerStation/:stationID/:yyyymmdd_from/:yyyymmdd_to/:format?', authService.verifyUser, async (req, res, next) => {
  try {
    const stationId = req.params.stationID
    const startDate = req.params.yyyymmdd_from
    const endDate = req.params.yyyymmdd_to

    const result = await myService.getCostPerStation(stationId, startDate, endDate)
    res.locals.data = { result }
    return next()
  } catch (err) {
    res.status(400).send('Invalid Input')
    console.log(err)
  }
}, csvjson)

module.exports = router
