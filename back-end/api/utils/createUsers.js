const faker = require('faker')
const mongoose = require('mongoose')
const fsLibrary = require('fs')

const UserService = require('../services/userService')
const CreateVehicles = require('./createVehicles')
const createStation = require('./createStation')
const config = require('config')
const createVehicles = new CreateVehicles()
const dict = {}
const user = new UserService()

module.exports = async () => {
  await createVehicles.createDataset('./electric_vehicles_data.json')

  for (let i = 0; i < config.dummyElectricalOperatorsCount; i++) { await createElectricalOperators() }
  for (let i = 0; i < config.dummyAdminsCount; i++) { await createAdmin() }
  await createRealAdmin()
  for (let i = 0; i < config.dummyVehicleOwnersCount; i++) { await createVehicleOwner() }
  for (let i = 0; i < config.dummyStationOwnersCount; i++) { await createStationOwner() }

  const json = JSON.stringify(dict)
  fsLibrary.writeFile('./user_passwords.json', json, 'utf8', (error) => {
    if (error) console.log('Error producing password txt file\n')
  })
  await createVehicles.dropDataset()
}

async function createVehicleOwner () {
  const carInstance = await createVehicles.createVehicle(getRndInteger(1, config.dummyMaxVehicles))
  const cars = []
  carInstance.forEach((c) => {
    cars.push({
      model: c.model,
      info: mongoose.Types.ObjectId(c._id)
    })
  })
  const usrnm = faker.internet.userName()
  const psw = faker.internet.password()
  dict[usrnm] = psw
  const newuser = {
    username: usrnm,
    password: psw,
    contact_info:
      {
        email: faker.internet.email(),
        phone: [faker.phone.phoneNumber()]
      },
    address: faker.fake('{{address.streetAddress}}, {{address.city}}'),
    account_type: 'vehicleOwner',
    cars: cars,
    payment_card: [{
      owner: faker.fake('{{name.lastName}}_{{name.firstName}}'),
      number: faker.finance.creditCardNumber(),
      cvv: faker.finance.creditCardCVV(),
      exp_date: '10/21'
    }]
  }
  const someUser = await user.createUserF(newuser)
  return someUser
}

async function createElectricalOperators () {
  // electrical company
  const usrnm = faker.fake('{{name.lastName}}_{{name.firstName}}')
  const psw = faker.internet.password()
  dict[usrnm] = psw
  const newuser = {
    username: usrnm,
    password: psw,
    account_type: 'electricalCompanyOperator',
    contact_info:
      {
        email: faker.internet.email(),
        phone: [faker.phone.phoneNumber()],
        website: faker.internet.domainName()
      },
    address: faker.fake('{{address.streetAddress}}, {{address.city}}'),
    cost_per_kwh: getRndFloat(0.2, 0.5),
    session_cost: getRndFloat(5, 10)
  }
  const someUser = await user.createUserF(newuser)
  return someUser
}

async function createStationOwner () {
  const stationInstance = await createStation(getRndInteger(1, config.dummyMaxStations))
  const stations = []
  stationInstance.forEach((c) => {
    stations.push({
      name: c.name,
      info: mongoose.Types.ObjectId(c._id)
    })
  })
  const usrnm = faker.fake('{{name.lastName}}_{{name.firstName}}')
  const psw = faker.internet.password()
  dict[usrnm] = psw
  const newuser = {
    username: usrnm,
    password: psw,
    contact_info:
      {
        email: faker.internet.email(),
        phone: [faker.phone.phoneNumber()],
        website: faker.internet.domainName()
      },
    address: faker.fake('{{address.streetAddress}}, {{address.city}}'),
    account_type: 'stationOwner',
    stations: stations
  }

  const someUser = await user.createUserF(newuser)
  return someUser
}

async function createAdmin () {
  const usrnm = faker.fake('{{name.lastName}}_{{name.firstName}}')
  const psw = faker.internet.password()
  dict[usrnm] = psw
  const newuser = {
    username: usrnm,
    password: psw,
    contact_info:
    {
      email: faker.internet.email(),
      phone: [faker.phone.phoneNumber()]
    },
    account_type: 'admin'
  }
  const someUser = await user.createUserF(newuser)
  return someUser
}

async function createRealAdmin () {
  const usrnm = config.DEFAULT_USER_NAME
  const psw = config.DEFAULT_USER_PASSWORD
  dict[usrnm] = psw
  const newuser = {
    username: usrnm,
    password: psw,
    contact_info:
    {
      email: faker.internet.email(),
      phone: [faker.phone.phoneNumber()]
    },
    account_type: 'admin'
  }
  const someUser = await user.createUserF(newuser)
  return someUser
}

function getRndInteger (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

function getRndFloat (min, max) {
  return ((Math.random() * (max - min)) + min).toFixed(2)
}
