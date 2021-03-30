const common = require('../../../common')

const chai = common.chai
const server = common.server
const config = common.config
const deleteDatabase = common.deleteDatabase
const createUsers = common.createUsers
const Station = common.Station
const PickRandom = common.pickRandom
const pickRandom = new PickRandom()

let token
let randStationOwner
let randElectricalCompanyOperator
let randStation

before(async () => {
  await deleteDatabase()
  await createUsers()
  token = await common.createAdminAndLogin()
  randElectricalCompanyOperator = await pickRandom.electricalCompanyOperator()
  randStationOwner = await pickRandom.stationOwner()
  randStation = randStationOwner.stations[0].info
  randStation = await Station.findById(randStation)
})

it('it should edit the name of a station', async () => {
  randStation.name = 'randomStation'
  randStation.operator = 'randomOperator'
  randStation.energy_provider = randElectricalCompanyOperator._id

  const res = await chai.request(server)
    .post(config.BASE_URL + '/stationmod/edit/' + randStationOwner._id + '/' + randStation._id)
    .set('X-OBSERVATORY-AUTH', token)
    .send(randStation)

  res.should.have.status(200)
})

it('it should not edit the name of a station- not right owner', async () => {
  try {
    const newrandStationOwner = await pickRandom.stationOwner()
    randStation.name = 'randomStation'
    randStation.operator = 'randomOperator'
    randStation.energy_provider = randElectricalCompanyOperator._id

    const res = await chai.request(server)
      .post(config.BASE_URL + '/stationmod/edit/' + newrandStationOwner._id + '/' + randStation._id)
      .set('X-OBSERVATORY-AUTH', token)
      .send(randStation)

    res.should.have.status(400)
  } catch (err) {
    err.should.not.be.equal(undefined)
  }
})
