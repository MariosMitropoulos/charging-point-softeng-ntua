const Session = require('../models/Session')
const dayjs = require('dayjs')

module.exports = class VehicleService {
  async getSessionsPerEV (carID, fromDate, toDate) {
    const dateFrom = dayjs(fromDate).format('YYYY-MM-DD HH:MM:SS')
    const dateTo = dayjs(toDate).format('YYYY-MM-DD HH:MM:SS')

    const output = {}

    output.VehicleID = carID
    output.RequestTimestamp = dayjs(new Date()).format('YYYY-MM-DD HH:MM:SS')
    output.PeriodFrom = dateFrom
    output.PeriodTo = dateTo
    output.TotalEnergyConsumed = Session.aggregate({ $group: { _id: 'carID', energy_delivered: { $sum: '$energy_delivered' } } })
    output.TotalEnergyConsumed.exec(function (err) {
      if (err) {
        console.log(err)
      }
    })
    const aux = Session.find({ start_date: { $gte: dateFrom }, end_date: { $lte: dateTo } }).select({ cars: 1 })
    aux.exec(function (err) {
      if (err) {
        console.log(err)
      }
    })
    output.NumberOfVisitedPoints = aux.findById(carID, 'number_of_visited_points')
    output.NumberOfVisitedPoints.exec(function (err) {
      if (err) {
        console.log(err)
      }
    })
    output.NumberOfVehicleChargingSessions = aux.findById(carID, 'number_of_vehicle_charging_sessions')
    output.NumberOfVehicleChargingSessions.exec(function (err) {
      if (err) {
        console.log(err)
      }
    })

    const sessionNum = Session.find({ start_date: { $gte: dateFrom }, end_date: { $lte: dateTo }, car: carID })
    sessionNum.exec(function (err) {
      if (err) {
        console.log(err)
      }
    })
    const VehicleChargingSessionsList = [] // the list we want to show
    let counter = 1
    for (const object in sessionNum) {
      const sessionObject = {}

      sessionObject.SessionIndex = counter
      sessionObject.SessionID = object._id
      sessionObject.EnergyProvider = object.energy_provider_used
      sessionObject.StartedOn = object.start_date
      sessionObject.FinishedOn = object.end_date
      sessionObject.EnergyDelivered = object.energy_delivered
      sessionObject.PricePolicyRef = object.price_policy_ref
      sessionObject.CostPerKWh = object.cost_per_kwh
      sessionObject.SessionCost = object.session_cost

      VehicleChargingSessionsList.push(sessionObject)
      counter++
    }
    output.VehicleChargingSessionsList = VehicleChargingSessionsList
  }
}
