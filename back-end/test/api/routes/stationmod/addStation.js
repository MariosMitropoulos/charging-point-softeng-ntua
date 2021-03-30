const common = require('../../../common')

const chai = common.chai
const server = common.server
const config = common.config
const deleteDatabase = common.deleteDatabase
const createUsers = common.createUsers
const Station = common.Station
const createAdminAndLogin = common.createAdminAndLogin
const PickRandom = common.pickRandom
const pickRandom = new PickRandom()

let token
const station = { name: 'MYSTATION', operator: 'someOperator' }

let randUser

before(async () => {
  await deleteDatabase()
  await createUsers()
  token = await createAdminAndLogin()
  randUser = await pickRandom.electricalCompanyOperator()
  station.energy_provider = randUser._id
})

it('it should create a station', async () => {
  const res = await chai.request(server)
    .post(config.BASE_URL + '/stationmod/add/' + randUser._id)
    .set('X-OBSERVATORY-AUTH', token)
    .send(station)

  res.should.have.status(200)

  const isInDatabase = Station.findOne(station)
  isInDatabase.should.be.not.equal(undefined)
})

it('it should not create a station- only name', async () => {
  try {
    const invalidStation = { name: station.name }
    const res = await chai.request(server)
      .post(config.BASE_URL + '/stationmod/add/' + randUser._id)
      .set('X-OBSERVATORY-AUTH', token)
      .send(invalidStation)

    res.should.have.status(400)
  } catch (err) {
    err.should.not.be.equal(undefined)
  }
})

it('it should not create a station- only operator', async () => {
  try {
    const invalidStation = { name: station.operator }
    const res = await chai.request(server)
      .post(config.BASE_URL + '/stationmod/add/' + randUser._id)
      .set('X-OBSERVATORY-AUTH', token)
      .send(invalidStation)

    res.should.have.status(400)
  } catch (err) {
    err.should.not.be.equal(undefined)
  }
})

it('it should not create a station- only energy provider', async () => {
  try {
    const invalidStation = { name: station.energy_provider }
    const res = await chai.request(server)
      .post(config.BASE_URL + '/stationmod/add/' + randUser._id)
      .set('X-OBSERVATORY-AUTH', token)
      .send(invalidStation)

    res.should.have.status(400)
  } catch (err) {
    err.should.not.be.equal(undefined)
  }
})
