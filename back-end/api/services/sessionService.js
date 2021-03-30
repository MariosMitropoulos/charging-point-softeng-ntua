/* eslint-disable no-undef */
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

    const myStation = await Point.find({ _id: pointId }, 'station', (err) => {
      if (err) console.log(err)
    })
    const myPointOperatorAux = await Station.find({ _id: myStation[0].station }, 'operator', (err) => {
      if (err) console.log(err)
    })
    const myPointOperator = myPointOperatorAux[0].operator

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

      // await Vehicle.findById(myVehicle, (err, car) => {
      //   if (err) console.log(err)
      //   else {
      //     const myElement = {
      //       SessionIndex: (toInteger(counter) + 1),
      //       SessionID: sessions[counter]._id,
      //       StartedOn: dayjs(sessions[counter].start_date).format('YYYY-MM-DD HH:mm:ss'),
      //       FinishedOn: dayjs(sessions[counter].end_date).format('YYYY-MM-DD HH:mm:ss'),
      //       Protocol: sessions[counter].protocol,
      //       EnergyDelivered: sessions[counter].energy_delivered,
      //       Payment: sessions[counter].payment,
      //       VehicleType: car.type,
      //       SessionCost: sessions[counter].session_cost
      //     }
      //     myList.push(myElement)
      //     totalEnergyDelivered += myElement.EnergyDelivered
      //   }
      // })

      const myCarType = await Vehicle.find({ _id: myVehicle }, 'type', (err) => {
        if (err) console.log(err)
      })

      const myElement = {
        SessionIndex: (toInteger(counter) + 1),
        SessionID: sessions[counter]._id,
        StartedOn: dayjs(sessions[counter].start_date).format('YYYY-MM-DD HH:mm:ss'),
        FinishedOn: dayjs(sessions[counter].end_date).format('YYYY-MM-DD HH:mm:ss'),
        Protocol: sessions[counter].protocol,
        EnergyDelivered: sessions[counter].energy_delivered,
        Payment: sessions[counter].payment,
        VehicleType: myCarType[0].type,
        SessionCost: sessions[counter].session_cost
      }
      myList.push(myElement)
      totalEnergyDelivered += myElement.EnergyDelivered
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
        { $group: { _id: '$car', sum: { $sum: '$energy_delivered' } } }
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

      sessionObject.SessionIndex = (toInteger(counter) + 1)
      sessionObject.SessionID = data[counter]._id
      sessionObject.EnergyProvider = data[counter].energy_provider_used
      sessionObject.StartedOn = dayjs(data[counter].start_date).format('YYYY-MM-DD HH:mm:ss')
      sessionObject.FinishedOn = dayjs(data[counter].end_date).format('YYYY-MM-DD HH:mm:ss')
      sessionObject.EnergyDelivered = data[counter].energy_delivered
      sessionObject.PricePolicyRef = data[counter].price_policy_ref
      sessionObject.CostPerKWh = data[counter].cost_per_kwh
      sessionObject.SessionCost = data[counter].session_cost
      // this helps if it's allowed
      sessionObject.KmCompleted = data[counter].current_kilometers

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
    result.SessionsSummaryList = myList

    return result
  }

  // ----------------------------------------------------------------------------------------------------------------------------

  async getKilometers (car, session1, session2) {
    const verifyCar = await Vehicle.find({ _id: car, $and: [{ sessions: session1 }, { sessions: session2 }] }, 'sessions', (err) => {
      if (err) console.log(err)
    }).exec()

    if (verifyCar.length === 0) {
      throw Object.assign(new Error('The given sessions don\'t belong to the specified vehicle'))
    }

    const km1 = await Session.findOne({ _id: session1 }, 'current_kilometers', (err) => {
      if (err) console.log(err)
    })
    const km2 = await Session.findOne({ _id: session2 }, 'current_kilometers', (err) => {
      if (err) console.log(err)
    })

    if (km1.current_kilometers >= km2.current_kilometers) {
      throw Object.assign(new Error('Invalid chronological order of the given sessions'))
    }

    const result = km2.current_kilometers - km1.current_kilometers

    return result
  }

  // ----------------------------------------------------------------------------------------------------------------------------

  async getBill (vehicle, date1, date2) {
    const car = vehicle

    if (date1 >= date2) {
      throw Object.assign(new Error('Invalid chronological order of the given dates'))
    }

    const dateFrom = dayjs(date1).format('YYYY-MM-DD HH:mm:ss')
    const dateTo = dayjs(date2).format('YYYY-MM-DD HH:mm:ss')

    const sessionsDone = await Vehicle.findById(car, 'sessions', (err) => {
      if (err) console.log(err)
    })

    const actual = []

    for (let i = 0; i < sessionsDone.sessions.length; i++) {
      actual.push(await Session.find(
        {
          _id: sessionsDone.sessions[i],
          start_date: {
            $gte: dateFrom,
            $lte: dateTo
          },
          end_date: {
            $gte: dateFrom,
            $lte: dateTo
          }
        }, (err) => {
          if (err) console.log(err)
        }).exec())
    }

    let sum = 0
    for (let i = 0; i < actual.length; i++) {
      if (actual[i].length === 0) {
        continue
      }
      sum += actual[i][0].session_cost
    }
    return sum.toFixed(2)
  }

  // ----------------------------------------------------------------------------------------------------------------------------

  async getEstimatedTimeAndCost (vehicle, capacity, mode) {
    const car = vehicle
    const currentCapacity = capacity
    const selectedMode = mode

    const usableCapacity = await Vehicle.findById(car, 'usable_battery_size', (err) => {
      if (err) console.log(err)
    })

    if (currentCapacity < 0 || currentCapacity > usableCapacity.usable_battery_size) {
      throw Object.assign(new Error('Capacity given is negative or is greater than the actual capacity of the car'))
    }

    if (selectedMode !== 'normal' && selectedMode !== 'fast') {
      throw Object.assign(new Error('Mode given is invalid'))
    }

    const leftToFill = (usableCapacity.usable_battery_size - currentCapacity).toFixed(2)

    let time
    let cost

    if (selectedMode === 'normal') {
      time = leftToFill / 7.5
      cost = (leftToFill * 0.5).toFixed(2)
    }

    if (selectedMode === 'fast') {
      time = leftToFill / 11.25
      cost = leftToFill
    }

    const rhours = Math.floor(time)
    const minutes = (time - rhours) * 60
    const rminutes = Math.round(minutes)

    const obj = {
      time: 'Estimated Time: ' + rhours + ' hour(s) and ' + rminutes + ' minute(s)',
      cost: 'Estimated Cost: ' + cost
    }

    return obj
  }

  // ----------------------------------------------------------------------------------------------------------------------------

  async getChargingPercentage (vehicle, capacity) {
    const car = vehicle
    const currentCapacity = capacity

    const usableCapacity = await Vehicle.findById(car, 'usable_battery_size', (err) => {
      if (err) console.log(err)
    })

    if (currentCapacity < 0 || currentCapacity > usableCapacity.usable_battery_size) {
      throw Object.assign(new Error('Capacity given is negative or is greater than the actual capacity of the car'))
    }

    let result
    const obj = {
      result: ((currentCapacity / usableCapacity.usable_battery_size) * 100).toFixed(2) + '%'
    }

    return obj
  }

  // ----------------------------------------------------------------------------------------------------------------------------

  async getCostPerStation (station, date1, date2) {
    if (date1 >= date2) {
      throw Object.assign(new Error('Invalid chronological order of the given dates'))
    }

    const energyDelivered = await this.getSessionsPerStation(station, date1, date2)

    const provider = await Station.findById(station, 'energy_provider', (err) => {
      if (err) console.log(err)
    })

    const providerCost = await User.findById(provider.energy_provider, 'cost_per_kwh', (err) => {
      if (err) console.log(err)
    })

    const result = (energyDelivered.TotalEnergyDelivered * providerCost.cost_per_kwh).toFixed(2)

    return result
  }
}
