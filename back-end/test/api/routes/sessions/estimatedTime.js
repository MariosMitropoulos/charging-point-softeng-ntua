const common = require('../../../common')

const chai = common.chai
const server = common.server
const config = common.config
const PickRandom = common.pickRandom
const pickRandom = new PickRandom()

let randomEV
let token
let currentCapacity

before(async () => {
  await common.deleteDatabase()
  await common.createUsers()
  await common.createSessions()
  token = await common.createAdminAndLogin()

  randomEV = await pickRandom.vehicle()
  currentCapacity = common.getRndInteger(10, randomEV.usable_battery_size)
})

it('it should return the estimated time and cost of normal mode', async () => {
  const res = await chai.request(server)
    .get(config.BASE_URL + '/EstimatedTimeAndCost/' + randomEV._id + '/' + currentCapacity + '/' + 'normal')
    .set('X-OBSERVATORY-AUTH', token)
    .send()
  res.should.have.status(200)
  const body = res.body
  body.should.have.property('time')
  body.should.have.property('cost')
})

it('it should return the estimated time and cost of fast mode', async () => {
  const res = await chai.request(server)
    .get(config.BASE_URL + '/EstimatedTimeAndCost/' + randomEV._id + '/' + currentCapacity + '/' + 'fast')
    .set('X-OBSERVATORY-AUTH', token)
    .send()
  res.should.have.status(200)
  const body = res.body
  body.should.have.property('time')
  body.should.have.property('cost')
})

it('it should not return the estimated time and cost of superduperfast mode- invalid mode', async () => {
  try {
    const res = await chai.request(server)
      .get(config.BASE_URL + '/EstimatedTimeAndCost/' + randomEV._id + '/' + currentCapacity + '/' + 'superduperfast')
      .set('X-OBSERVATORY-AUTH', token)
      .send()
    res.should.have.status(200)
    const body = res.body
    body.should.have.property('time')
    body.should.have.property('cost')
  } catch (err) {
    err.should.not.be.equal(undefined)
  }
})
