const Session = require('../models/Session')
const Station = require('../models/Station')
const Vehicle = require('../models/Vehicle')
const Point = require('../models/Point')
const User = require('../models/User')
const dayjs = require('dayjs')
const { toInteger } = require('lodash')

module.exports = class SessionService {
  deleteAll () {
    Session.Session.deleteMany()
      .then(() => {
        return true
      })
      .catch((errors) => {
        throw errors
      })
  }

  // ------------------------------------------------------------------------------------------------------------------

  async getSessionsPerPoint (pointId, startDate, endDate) {
    let result = {}

    const myStation = Session.find({ point: pointId }).select({ station: 1 }).exec(function (err, data) {
      if (err) console.log(err)
    })
    const myPointOperator = Station.find({ _id: myStation }).select({ operator: 1 }).exec(function (err, data) {
      if (err) console.log(err)
    })

    // Finding date and time of call
    const myRequestTimestamp = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')

    const dateFrom = dayjs(startDate).format('YYYY-MM-DD HH:mm:ss')
    const dateTo = dayjs(endDate).format('YYYY-MM-DD HH:mm:ss')

    const sessions = await Session.find(
      {
        point: pointId,
        start_date: {
          $gte: dateFrom,
          $lte: dateTo
        }
      }).sort({ start_date: 1 })

    // Finding requested items and creating the list
    const myList = []
    let totalEnergyDelivered = 0

    for (const counter in sessions) {
      const myVehicle = sessions[counter].car

      await Vehicle.findById(myVehicle, (err, car) => {
        if (err) console.log(err)
        else {
          const myElement = {
            SessionIndex: (toInteger(counter) + 1),
            SessionID: sessions[counter]._id,
            StartedOn: dayjs(sessions[counter].start_date).format('YYYY-MM-DD HH:mm:ss'),
            FinishedOn: dayjs(sessions[counter].end_date).format('YYYY-MM-DD HH:mm:ss'),
            Protocol: sessions[counter].protocol,
            EnergyDelivered: sessions[counter].energy_delivered,
            Payment: sessions[counter].payment,
            VehicleType: car.type
          }
          myList.push(myElement)
          totalEnergyDelivered += myElement.EnergyDelivered
        }
      })
    }
    result = {
      Point: pointId,
      PointOperator: myPointOperator,
      RequestTimestamp: myRequestTimestamp,
      PeriodFrom: dateFrom,
      PeriodTo: dateTo,
      NumberOfChargingSessions: sessions.length,
      ChargingSessionsList: myList,
      TotalEnergyDelivered: totalEnergyDelivered
    }
    return result
  }
  // ----------------------------------------------------------------------------------------------------------------------------

  async getSessionsPerStation (stationId, startDate, endDate) {
    const result = {}

    result.StationID = stationId

    const myOperator = await Station.find({ _id: stationId }, 'operator', (err) => {
      if (err) console.log(err)
    })
    result.Operator = myOperator[0].operator

    // Finding date and time of call
    result.RequestTimestamp = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')

    result.PeriodFrom = dayjs(startDate).format('YYYY-MM-DD HH:mm:ss')
    result.PeriodTo = dayjs(endDate).format('YYYY-MM-DD HH:mm:ss')

    const aux = await Station.find({ _id: stationId }, 'points', (err) => {
      if (err) console.log(err)
    })
    const stationPoints = aux[0].points

    let currentItem; let totalEnergy = 0; let totalChargingSessions = 0; let activePoints = 0
    const myList = []
    for (const counter in stationPoints) {
      currentItem = await this.getSessionsPerPoint(stationPoints[counter], startDate, endDate)

      if (currentItem.NumberOfChargingSessions !== 0) {
        totalEnergy += currentItem.TotalEnergyDelivered
        totalChargingSessions += currentItem.NumberOfChargingSessions
        activePoints++

        const myElement = {}
        myElement.PointID = currentItem.Point
        myElement.PointSessions = currentItem.NumberOfChargingSessions
        myElement.EnergyDelivered = currentItem.TotalEnergyDelivered
        myList.push(myElement)
      }
    }
    result.TotalEnergyDelivered = totalEnergy
    result.NumberOfChargingSessions = totalChargingSessions
    result.NumberOfActivePoints = activePoints
    result.SessionsSummaryList = myList

    return result
  }

  // ----------------------------------------------------------------------------------------------------------------------------

  async getSessionsPerEV (carID, fromDate, toDate) {

    const dateFrom = dayjs(fromDate).format('YYYY-MM-DD HH:mm:ss')
    const dateTo = dayjs(toDate).format('YYYY-MM-DD HH:mm:ss')

    const output = {}

    output.VehicleID = carID
    output.RequestTimestamp = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    output.PeriodFrom = dateFrom
    output.PeriodTo = dateTo

    const TotalEnergyConsumed = await Session.aggregate(
      [
        // { $match: { car: carID } },
        { $group: { _id: "$car", sum: { $sum: "$energy_delivered" } } }
      ], (err) => {
        if (err) console.log(err)
      })
    // i do this because $match doesn't work
    TotalEnergyConsumed.forEach(element => {
      if (element._id == carID) {
        output.TotalEnergyConsumed = element.sum
      }
    })

    const mySessions = await Session.find(
      {
        start_date: {
          $gte: dateFrom,
          $lte: dateTo
        },
        car: carID
      }, (err) => {
        if (err) console.log(err)
      })

    output.NumberOfVisitedPoints = await Session.distinct('point',
    {
      start_date: {
        $gte: dateFrom,
        $lte: dateTo
      },
      car: carID
    }, (err) => {
      if (err) console.log(err)
    }).countDocuments()

    output.NumberOfVehicleChargingSessions = mySessions.length

    const myList = [] // the list we want to show
    const data = mySessions

    for (const counter in data) {
      const sessionObject = {}

      sessionObject.SessionIndex = (toInteger(counter)+1)
      sessionObject.SessionID = data[counter]._id
      sessionObject.EnergyProvider = data[counter].energy_provider_used
      sessionObject.StartedOn = dayjs(data[counter].start_date).format('YYYY-MM-DD HH:mm:ss')
      sessionObject.FinishedOn = dayjs(data[counter].end_date).format('YYYY-MM-DD HH:mm:ss')
      sessionObject.EnergyDelivered = data[counter].energy_delivered
      sessionObject.PricePolicyRef = data[counter].price_policy_ref
      sessionObject.CostPerKWh = data[counter].cost_per_kwh
      sessionObject.SessionCost = data[counter].session_cost

      myList.push(sessionObject)
    }
    output.VehicleChargingSessionsList = myList

    return output
  }

  // ----------------------------------------------------------------------------------------------------------------------------

  async getSessionsPerProvider (providerId, startDate, endDate) {
    const result = {}

    result.ProviderID = providerId

    const myProviderName = await User.find({ _id: providerId }, 'username', (err) => {
      if (err) console.log(err)
    })
    result.ProviderName = myProviderName[0].username

    const mySessions = await Session.find({
      energy_provider_used: providerId,
      start_date: {
        $gte: dayjs(startDate).format('YYYY-MM-DD HH:mm:ss'),
        $lte: dayjs(endDate).format('YYYY-MM-DD HH:mm:ss')
      }
    }).sort({ start_date: 1 })

    const myList = []
    let myPoint

    for (const counter in mySessions) {
      const myElement = {}

      myPoint = mySessions[counter].point

      const myStation = await Point.find({ _id: myPoint }, 'station', (err) => {
        if (err) console.log(err)
      })
      myElement.StationID = myStation[0].station
      myElement.SessionID = mySessions[counter]._id
      myElement.VehicleID = mySessions[counter].car
      myElement.StartedOn = dayjs(mySessions[counter].start_date).format('YYYY-MM-DD HH:mm:ss')
      myElement.FinishedOn = dayjs(mySessions[counter].end_date).format('YYYY-MM-DD HH:mm:ss')
      myElement.EnergyDelivered = mySessions[counter].energy_delivered
      myElement.PricePolicyRef = mySessions[counter].price_policy_ref
      myElement.CostPerKWh = mySessions[counter].cost_per_kwh
      myElement.TotalCost = mySessions[counter].session_cost

      myList.push(myElement)
    }
    result.myList = myList

    console.log(result)
    return result
  }

  // ----------------------------------------------------------------------------------------------------------------------------

  async getKilometers (session1, session2){
    const km1 = await Session.findOne({_id: session1}, 'current_kilometers')
    const km2 = await Session.findOne({_id: session2}, 'current_kilometers')

    const result = km2.current_kilometers - km1.current_kilometers
    return result
  }
}
