const common = require('../../../common')

const chai = common.chai
const server = common.server
const config = common.config
const deleteDatabase = common.deleteDatabase
const createUsers = common.createUsers
const PickRandom = common.pickRandom
const pickRandom = new PickRandom()

let token
let randVehicleOwner
let randStation

before(async () => {
  await deleteDatabase()
  await createUsers()
  token = await common.createAdminAndLogin()
  randVehicleOwner = await pickRandom.vehicleOwner()
  randStation = await pickRandom.station()
})

it('it should add a review to a station', async () => {
  const review = {
    date: Date.now(),
    by: randVehicleOwner._id,
    rating: 5,
    comment: 'It was a great station'
  }
  const res = await chai.request(server)
    .post(config.BASE_URL + '/stationmod/addreview/' + randVehicleOwner._id + '/' + randStation._id)
    .set('X-OBSERVATORY-AUTH', token)
    .send(review)

  res.should.have.status(200)
})

it('it should not add a review to a station- missing user', async () => {
  try {
    const review = {
      date: Date.now(),
      rating: 5,
      comment: 'It was a great station'
    }
    const res = await chai.request(server)
      .post(config.BASE_URL + '/stationmod/addreview/' + randVehicleOwner._id + '/' + randStation._id)
      .set('X-OBSERVATORY-AUTH', token)
      .send(review)

    res.should.have.status(404)
  } catch (err) {
    err.should.not.be.equal(undefined)
  }
})
