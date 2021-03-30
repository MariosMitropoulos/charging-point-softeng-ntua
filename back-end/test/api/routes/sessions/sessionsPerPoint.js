const common = require('../../../common')

const chai = common.chai
const server = common.server
const config = common.config
const PickRandom = common.pickRandom
const pickRandom = new PickRandom()
const dayjs = common.dayjs

let randomPoint
let randomPointSessionCount
let token

let currentDate
let firstDate
let secondDate

before(async () => {
  await common.deleteDatabase()
  await common.createUsers()
  await common.createSessions()
  token = await common.createAdminAndLogin()
  randomPoint = await pickRandom.point()
  randomPointSessionCount = randomPoint.sessions.length
  const firstSession = await common.Session.findById(randomPoint.sessions[0])
  const secondSession = await common.Session.findById(randomPoint.sessions[1])
  currentDate = dayjs(Date.now()).format('YYYYMMDD')
  firstDate = dayjs(firstSession.start_date).format('YYYYMMDD')
  secondDate = dayjs(secondSession.start_date).format('YYYYMMDD')
})

it('it should return all sessions', async () => {
  const res = await chai.request(server)
    .get(config.BASE_URL + '/SessionsPerPoint/' + randomPoint._id + '/' + firstDate + '/' + currentDate)
    .set('X-OBSERVATORY-AUTH', token)
    .send()
  res.should.have.status(200)
  const body = res.body
  console.log(body)
  body.should.have.property('Point')
  body.should.have.property('PointOperator')
  body.should.have.property('RequestTimestamp')
  body.should.have.property('PeriodFrom')
  body.should.have.property('PeriodTo')
  body.should.have.property('NumberOfChargingSessions')
  body.should.have.property('ChargingSessionsList')
  body.ChargingSessionsList.should.have.lengthOf(randomPointSessionCount)
  body.ChargingSessionsList.forEach(e => {
    e.should.have.property('SessionIndex')
    e.should.have.property('SessionID')
    e.should.have.property('StartedOn')
    e.should.have.property('FinishedOn')
    e.should.have.property('Protocol')
    e.should.have.property('EnergyDelivered')
    e.should.have.property('Payment')
    e.should.have.property('VehicleType')
  })
})

it('it should return all sessions minus one', async () => {
  const res = await chai.request(server)
    .get(config.BASE_URL + '/SessionsPerPoint/' + randomPoint._id + '/' + secondDate + '/' + currentDate)
    .set('X-OBSERVATORY-AUTH', token)
    .send()
  res.should.have.status(200)
  const body = res.body
  console.log(body)
  body.should.have.property('Point')
  body.should.have.property('PointOperator')
  body.should.have.property('RequestTimestamp')
  body.should.have.property('PeriodFrom')
  body.should.have.property('PeriodTo')
  body.should.have.property('NumberOfChargingSessions')
  body.should.have.property('ChargingSessionsList')
  body.ChargingSessionsList.length.should.be.not.least(randomPointSessionCount)
  body.ChargingSessionsList.forEach(e => {
    e.should.have.property('SessionIndex')
    e.should.have.property('SessionID')
    e.should.have.property('StartedOn')
    e.should.have.property('FinishedOn')
    e.should.have.property('Protocol')
    e.should.have.property('EnergyDelivered')
    e.should.have.property('Payment')
    e.should.have.property('VehicleType')
  })
})
