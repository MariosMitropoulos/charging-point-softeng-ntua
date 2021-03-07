const express = require('express')
// const { result } = require('lodash')
const router = express.Router()
const User = require('../models/User')
const Session = require('../models/Session')
const Point = require('../models/Point')
const Station = require('../models/Station')
const Vehicle = require('../models/Vehicle')
const SessionService = require('../services/sessionService')

const myService = new SessionService()

router.get('/userCards/:userID', async (req, res, next) => {
  try {
    const userId = req.params.userID
    const myCards = await User.find({ _id: userId }, 'payment_card')

    res.send(myCards)
  } catch (err) {
    res.sendStatus(400)
    console.log(err)
  }
})

// router.post('/userCards/addCard/:userID/:owner/:cardNumber/:cvv/:expDate', (req, res, next) => {
//   try {
//     const userId = req.params.userID
//     const owner = req.params.owner
//     const cardNumber = req.params.cardNumber
//     const cvv = req.params.cvv
//     const expDate = req.params.expDate

//     User.findByIdAndUpdate(userId,
//       { $push: { payment_card: { owner: owner, number: cardNumber, cvv: cvv, exp_date: expDate } } })
//     res.send({ payment_card: { owner: owner, number: cardNumber, cvv: cvv, exp_date: expDate } })
//   } catch (err) {
//     console.log(err)
//     res.status(400)
//     res.send()
//   }
// })

router.get('/stationsVisited/:userID', async (req, res, next) => {
  try {
    const userId = req.params.userID
    const myStations = []

    const myCars = await User.find({ _id: userId }, 'cars', (err) => {
      if (err) console.log(err)
    })

    let carSessions, myElement, currStation, currStationInfo
    for (const i in myCars[0].cars) {
      carSessions = await Session.find({ car: myCars[0].cars[i].info }, 'point start_date', (err) => {
        if (err) console.log(err)
      })
      for (const j in carSessions) {
        currStation = await Point.find({ _id: carSessions[j].point }, 'station', (err) => {
          if (err) console.log(err)
        })
        currStationInfo = await Station.find({ _id: currStation[0].station }, 'name address', (err) => {
          if (err) console.log(err)
        })
        myElement = {
          stationId: currStation[0].station,
          name: currStationInfo[0].name,
          address: currStationInfo[0].address,
          date: carSessions[j].start_date
        }
        myStations.push(myElement)
      }
    }
    myStations.sort((a, b) => b.date - a.date)

    let stationsToBeDiscovered = 5
    const DiscoveredStationsList = []

    for (const i in myStations) {
      if (stationsToBeDiscovered === 0) break
      if (!DiscoveredStationsList.some(element => JSON.stringify(element.stationId) === JSON.stringify(myStations[i].stationId))) {
        DiscoveredStationsList.push(myStations[i])
        stationsToBeDiscovered--
      }
    }

    res.send(DiscoveredStationsList)
  } catch (err) {
    res.sendStatus(400)
    console.log(err)
  }
})

router.get('/userCars/:userID', async (req, res, next) => {
  const userId = req.params.userID
  try {
    const myCarsAux = await User.find({ _id: userId }, 'cars', (err) => {
      if (err) console.log(err)
    })
    const myCars = myCarsAux[0].cars
    const result = []
    let someCar

    for (const i in myCars) {
      const carInfo = await Vehicle.find({ _id: myCars[i].info }, 'brand usable_battery_size', (err) => {
        if (err) console.log(err)
      })
      someCar = myCars[i].toJSON()
      someCar.brand = carInfo[0].brand
      someCar.usable_battery_size = carInfo[0].usable_battery_size
      console.log(someCar)
      result.push(someCar)
    }

    res.send(result)
  } catch (err) {
    res.sendStatus(400)
    console.log(err)
  }
})

router.get('/userCars/analytics/:userID/:carID/:startDate/:endDate', async (req, res, next) => {
  try {
    const userId = req.params.userID
    const carId = req.params.carID
    const startDate = req.params.startDate
    const endDate = req.params.endDate

    const result = []
    let myElement

    const myCars = await User.find({ _id: userId }, 'cars', (err) => {
      if (err) console.log(err)
    })

    if (carId === 'all') {
      for (const i in myCars[0].cars) {
        const carSessions = await myService.getSessionsPerEV(myCars[0].cars[i].info, startDate, endDate)

        myElement = {
          _id: myCars[0].cars[i].info,
          sessions: carSessions.VehicleChargingSessionsList
        }

        for (const j in myElement.sessions) {
          if (j != myElement.sessions.length - 1) {
            myElement.sessions[j].KmUntilNextSession = myElement.sessions[parseInt(j) + 1].KmCompleted - myElement.sessions[j].KmCompleted
          } else {
            myElement.sessions[j].KmUntilNextSession = 0
          }
        }

        result.push(myElement)
      }
    } else {
      const carSessions = await myService.getSessionsPerEV(carId, startDate, endDate)

      for (const j in carSessions.VehicleChargingSessionsList) {
        if (j != carSessions.VehicleChargingSessionsList.length - 1) {
          carSessions.VehicleChargingSessionsList[j].KmUntilNextSession = carSessions.VehicleChargingSessionsList[parseInt(j) + 1].KmCompleted - carSessions.VehicleChargingSessionsList[j].KmCompleted
        } else {
          carSessions.VehicleChargingSessionsList[j].KmUntilNextSession = 0
        }
      }

      result.push({
        _id: carId,
        sessions: carSessions.VehicleChargingSessionsList
      })
    }

    res.send(result)
  } catch (err) {
    res.sendStatus(400)
    console.log(err)
  }
})

router.get('/getAllSessions/:userID', async (req, res, next) => {
  try {
    const userId = req.params.userID

    let result = []

    const myCars = await User.find({ _id: userId }, 'cars', (err) => {
      if (err) console.log(err)
    })
    for (const i in myCars[0].cars) {
      const carSessions = await Session.find({ car: myCars[0].cars[i].info }, (err) => {
        if (err) console.log(err)
      })
      let someSession
      for (const j in carSessions) {
        const carInfo = await Vehicle.find({ _id: carSessions[j].car }, 'model brand', (err) => {
          if (err) console.log(err)
        })
        someSession = carSessions[j].toJSON()
        someSession.carModel = carInfo[0].model
        someSession.carBrand = carInfo[0].brand
      }
      result = result.concat(someSession)
    }
    result.sort((a, b) => b.start_date - a.start_date)

    res.send(result)
  } catch (err) {
    res.sendStatus(400)
    console.log(err)
  }
})

router.get('/getStationsAndPoints/:userID', async (req, res, next) => {
  try {
    const userId = req.params.userID

    const result = []

    const myStationsAux = await User.find({ _id: userId }, 'stations', (err) => {
      if (err) console.log(err)
    })
    const myStations = myStationsAux[0].stations

    for (const i in myStations) {
      const StationPoints = await Station.find({ _id: myStations[i].info }, 'address points', (err) => {
        if (err) console.log(err)
      })
      const myElement = {
        _id: myStations[i].info,
        name: myStations[i].name,
        points: StationPoints[0].points
      }
      result.push(myElement)
    }
    res.send(result)
  } catch (err) {
    res.sendStatus(400)
    console.log(err)
  }
})

router.get('/getStationsAndReviews/:userID', async (req, res, next) => {
  try {
    const userId = req.params.userID

    const result = []

    const myStationsAux = await User.find({ _id: userId }, 'stations', (err) => {
      if (err) console.log(err)
    })
    const myStations = myStationsAux[0].stations

    for (const i in myStations) {
      const StationReviews = await Station.find({ _id: myStations[i].info }, 'reviews', (err) => {
        if (err) console.log(err)
      })
      const myElement = {
        _id: myStations[i].info,
        reviews: StationReviews[0].reviews
      }
      result.push(myElement)
    }
    res.send(result)
  } catch (err) {
    res.sendStatus(400)
    console.log(err)
  }
})

router.get('/userStations/:userID', async (req, res, next) => {
  try {
    const userId = req.params.userID

    const result = []

    const myStationsAux = await User.find({ _id: userId }, 'stations', (err) => {
      if (err) console.log(err)
    })
    const myStations = myStationsAux[0].stations
    let myElement, myStationInfo

    for (const i in myStations) {
      myStationInfo = await Station.find({ _id: myStations[i].info }, (err) => {
        if (err) console.log(err)
      })
      myElement = myStationInfo[0]
      result.push(myElement)
    }
    res.send(result)
  } catch (err) {
    res.sendStatus(400)
    console.log(err)
  }
})

router.get('/userStations/analytics/:userID/:stationID/:startDate/:endDate', async (req, res, next) => {
  try {
    const userId = req.params.userID
    const stationId = req.params.stationID
    const startDate = req.params.startDate
    const endDate = req.params.endDate

    let result
    let myElement

    const myStationsAux = await User.find({ _id: userId }, 'stations', (err) => {
      if (err) console.log(err)
    })
    const myStations = myStationsAux[0].stations

    if (stationId === 'all') {
      result = []
      for (const i in myStations) {
        const stationPointsAux = await Station.find({ _id: myStations[i].info }, 'points', (err) => {
          if (err) console.log(err)
        })
        const stationPoints = stationPointsAux[0].points
        let sessionList = []

        for (const j in stationPoints) {
          const pointSessions = await myService.getSessionsPerPoint(stationPoints[j], startDate, endDate)
          sessionList = sessionList.concat(pointSessions.ChargingSessionsList)
        }
        myElement = {
          _id: myStations[i].info,
          sessions: sessionList
        }
        result.push(myElement)
      }
    } else {
      const stationPointsAux = await Station.find({ _id: stationId }, 'points', (err) => {
        if (err) console.log(err)
      })
      const stationPoints = stationPointsAux[0].points
      let sessionList = []

      for (const j in stationPoints) {
        const pointSessions = await myService.getSessionsPerPoint(stationPoints[j], startDate, endDate)
        sessionList = sessionList.concat(pointSessions.ChargingSessionsList)
      }
      result = {
        _id: stationId,
        sessions: sessionList
      }
    }
    res.send(result)
  } catch (err) {
    res.sendStatus(400)
    console.log(err)
  }
})

router.get('/getAllSessionsForStationOwner/:userID', async (req, res, next) => {
  try {
    const userId = req.params.userID

    const result = []
    let myElement

    const myStationsAux = await User.find({ _id: userId }, 'stations', (err) => {
      if (err) console.log(err)
    })
    const myStations = myStationsAux[0].stations

    for (const i in myStations) {
      const stationPointsAux = await Station.find({ _id: myStations[i].info }, 'points operator contact_info', (err) => {
        if (err) console.log(err)
      })
      const stationPoints = stationPointsAux[0].points

      for (const j in stationPoints) {
        const pointSessionsAux = await Point.find({ _id: stationPoints[j] }, 'sessions', (err) => {
          if (err) console.log(err)
        })
        const pointSessions = pointSessionsAux[0].sessions

        for (const k in pointSessions) {
          const sessionInfoAux = await Session.find({ _id: pointSessions[k] }, (err) => {
            if (err) console.log(err)
          })
          const sessionInfo = sessionInfoAux[0]

          myElement = sessionInfo.toJSON()
          myElement.StationOperator = stationPointsAux[0].operator
          myElement.StationInfo = stationPointsAux[0].contact_info
          result.push(myElement)
        }
      }
    }
    res.send(result)
  } catch (err) {
    res.sendStatus(400)
    console.log(err)
  }
})

module.exports = router
