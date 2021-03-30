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
let randStation

before(async () => {
  await deleteDatabase()
  await deleteDatabase()
  await createUsers()
  token = await common.createAdminAndLogin()
  randStationOwner = await pickRandom.stationOwner()
  randStation = randStationOwner.stations[0].info
  randStation = await Station.findById(randStation)
})

it('it should delete a station', async () => {
  const res = await chai.request(server)
    .post(config.BASE_URL + '/stationmod/delete/' + randStationOwner._id + '/' + randStation._id)
    .set('X-OBSERVATORY-AUTH', token)

  res.should.have.status(200)
  const checkEntry = await Station.findById(randStation._id)
  const result = checkEntry === null
  result.should.be.equal(true)
})

it('it should delete a station- not right owner', async () => {
  // try {
  const newrandStationOwner = await pickRandom.vehicleOwner()
  const res = await chai.request(server)
    .post(config.BASE_URL + '/stationmod/delete/' + newrandStationOwner._id + '/' + randStation._id)
    .set('X-OBSERVATORY-AUTH', token)
  console.log(res)
  res.should.have.status(401)
})
