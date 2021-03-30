const mongoose = require('mongoose')
const faker = require('faker')
const userModel = require('../models/User')
const stationModel = require('../models/Station')
const CreatePoints = require('./createPoints')
const config = require('config')
const createPoints = new CreatePoints()

module.exports = async (count) => {
  const userCount = config.dummyElectricalOperatorsCount
  const vehicleOwnerCount = config.dummyVehicleOwnersCount
  const finalStations = []
  const currentDate = new Date(Date.now())
  const finalRandomDate = addDays(currentDate, -5)

  for (let i = 0; i < count; i++) {
    const random = getRandomInt(userCount)
    const random1 = getRandomInt(vehicleOwnerCount)
    const random2 = getRandomInt(vehicleOwnerCount)
    const random3 = getRandomInt(vehicleOwnerCount)

    const randUser = await userModel.findOne({ account_type: 'electricalCompanyOperator' }, 'username _id').skip(random)

    const reviewUser = []
    const randReviewUser1 = await userModel.findOne({ account_type: 'vehicleOwner' }, 'username _id').skip(random1)
    reviewUser.push(randReviewUser1._id)
    const randReviewUser2 = await userModel.findOne({ account_type: 'vehicleOwner' }, 'username _id').skip(random2)
    reviewUser.push(randReviewUser2._id)
    const randReviewUser3 = await userModel.findOne({ account_type: 'vehicleOwner' }, 'username _id').skip(random3)
    reviewUser.push(randReviewUser3._id)

    const reviewList = []
    for (let j = 0; j < 3; j++) {
      reviewList.push({
        date: randomDate(addDays(finalRandomDate, -730), finalRandomDate),
        by: mongoose.Types.ObjectId(reviewUser[j]),
        rating: getRndInteger(1, 10),
        comment: faker.lorem.sentence()
      })
    }

    const stationCity = faker.fake('{{address.city}}')

    const newStation = {
      name: 'ChargingPoint ' + stationCity + ' Station',
      address: faker.fake('{{address.streetAddress}}') + ', ' + stationCity,
      contact_info:
      {
        email: faker.internet.email(),
        phone: [faker.phone.phoneNumber()]
      },
      operator: faker.internet.userName(),
      energy_provider: mongoose.Types.ObjectId(randUser._id),
      reviews: reviewList
    }

    const res = await stationModel.create(newStation)
    const stationID = res._id
    const pointInstance = await createPoints.createPoints(getRndInteger(config.dummyMinPoints, config.dummyMaxPoints), stationID)
    const pointsList = []

    pointInstance.forEach((c) => {
      pointsList.push(mongoose.Types.ObjectId(c._id))
    })

    const v = await stationModel.findByIdAndUpdate(stationID, {
      points: pointsList
    })

    finalStations.push(v)
  }

  return finalStations
}

function getRandomInt (max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function getRndInteger (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

function randomDate (start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function addDays (date, days) {
  const copy = new Date(Number(date))
  copy.setDate(date.getDate() + days)
  return copy
}
