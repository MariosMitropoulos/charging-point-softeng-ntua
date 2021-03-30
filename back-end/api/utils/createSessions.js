const mongoose = require('mongoose')
const sessionModel = require('../models/Session')
const pointModel = require('../models/Point')
const vehicleModel = require('../models/Vehicle')
const userModel = require('../models/User')
const stationModel = require('../models/Station')
const ObjectsToCsv = require('objects-to-csv')
const config = require('config')

const paymentType = ['Bank Card', 'PayPal']
let startDate
let startKilometers = 20
let pointsCount
let vehiclesCount

module.exports = async (req, res) => {
  pointsCount = await pointModel.countDocuments()
  vehiclesCount = await vehicleModel.countDocuments()

  if (pointsCount === 0) {
    res.status(204)
    res.send({ status: 'failed' })
  }
  const saveToCSV = (req.params.dest === 'csv')
  try {
    const sessions = []
    const currentDate = new Date(Date.now())
    const finalRandomDate = addDays(currentDate, -(1 + pointsCount * config.dummyAverageSessionsPerPoint))
    startDate = randomDate(addDays(finalRandomDate, -5), finalRandomDate)
    for (let i = 0; i < pointsCount * config.dummyAverageSessionsPerPoint; i++) {
      startDate = addDays(startDate, 1)
      startKilometers += 20
      await createSessions(startDate, startKilometers, saveToCSV, sessions)
    }

    if (saveToCSV) {
      const csv = new ObjectsToCsv(sessions)
      await csv.toDisk('./sessions.csv')
    }

    res.send({ status: 'OK' })
  } catch (err) {
    console.log(err)
    res.status(400)
    res.send({ status: 'failed' })
  }
}

async function createSessions (date, kilometers, saveToCSV, sessions) {
  const random = getRandomInt(vehiclesCount)
  const random1 = getRandomInt(pointsCount)
  const randVehicle = await vehicleModel.findOne({}, '_id').skip(random)
  const randPoint = await pointModel.findOne({}, '_id').skip(random1)
  const randStation = await stationModel.findOne({ points: { $in: randPoint._id } }, 'energy_provider')
  const randUser = randStation.energy_provider

  const costPerMinute = getRndFloat(0.03, 0.07)
  const sessionDuration = getRndInteger(2, 8)
  const newSession = {
    cost_per_kwh: getRndFloat(0.2, 0.5),
    session_cost: (costPerMinute * sessionDuration * 60).toFixed(2),
    payment: paymentType[getRandomInt(0, 1)],
    start_date: date,
    end_date: addHours(date, sessionDuration),
    current_kilometers: kilometers,
    energy_delivered: getRndFloat(25, 35),
    protocol: 'OCPP2.0',
    price_policy_ref: '18 cents per kilowatt hour(kWh)',
    car: mongoose.Types.ObjectId(randVehicle._id),
    point: mongoose.Types.ObjectId(randPoint._id),
    energy_provider_used: mongoose.Types.ObjectId(randUser._id)
  }
  if (!saveToCSV) {
    const res = await sessionModel.create(newSession)
    const sessionID = res._id
    await pointModel.findByIdAndUpdate(randPoint._id, { $push: { sessions: mongoose.Types.ObjectId(sessionID) } })
    await vehicleModel.findByIdAndUpdate(randVehicle._id, { $push: { sessions: mongoose.Types.ObjectId(sessionID) } })
    await userModel.findByIdAndUpdate(randUser._id, { $push: { electricalCompanyOperatorSessions: mongoose.Types.ObjectId(sessionID) } })
  } else {
    newSession.car = newSession.car.toString()
    newSession.point = newSession.point.toString()
    newSession.energy_provider_used = newSession.energy_provider_used.toString()
    sessions.push(newSession)
  }
}

function getRndFloat (min, max) {
  return ((Math.random() * (max - min)) + min).toFixed(2)
}

function getRndInteger (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

function getRandomInt (max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function randomDate (start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function addHours (date, hours) {
  const copy = new Date(Number(date))
  copy.setHours(date.getHours() + hours)
  return copy
}

function addDays (date, days) {
  const copy = new Date(Number(date))
  copy.setDate(date.getDate() + days)
  return copy
}
