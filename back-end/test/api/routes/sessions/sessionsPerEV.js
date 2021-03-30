const common = require('../../../common')

const chai = common.chai
const server = common.server
const config = common.config
const PickRandom = common.pickRandom
const pickRandom = new PickRandom()
const dayjs = common.dayjs

let randomEV
let token

let currentDate
let firstDate

before(async () => {
  await common.deleteDatabase()
  await common.createUsers()
  await common.createSessions()
  token = await common.createAdminAndLogin()
  randomEV = await pickRandom.vehicle()
  currentDate = dayjs(Date.now()).format('YYYYMMDD')
  firstDate = Date.now()
  firstDate = dayjs(firstDate).subtract(10, 'year').format('YYYYMMDD')
})

it('it should return all sessions', async () => {
  const res = await chai.request(server)
    .get(config.BASE_URL + '/SessionsPerEV/' + randomEV._id + '/' + firstDate + '/' + currentDate)
    .set('X-OBSERVATORY-AUTH', token)
    .send()
  res.should.have.status(200)
  const body = res.body
  body.should.have.property('VehicleID')
  body.should.have.property('RequestTimestamp')
  body.should.have.property('PeriodFrom')
  body.should.have.property('PeriodTo')
  body.should.have.property('TotalEnergyConsumed')
  body.should.have.property('NumberOfVisitedPoints')
  body.should.have.property('NumberOfVehicleChargingSessions')
  body.should.have.property('VehicleChargingSessionsList')
  body.VehicleChargingSessionsList.should.have.lengthOf(body.NumberOfVehicleChargingSessions)
  body.VehicleChargingSessionsList.forEach(e => {
    e.should.have.property('SessionIndex')
    e.should.have.property('SessionID')
    e.should.have.property('EnergyProvider')
    e.should.have.property('StartedOn')
    e.should.have.property('FinishedOn')
    e.should.have.property('EnergyDelivered')
    e.should.have.property('PricePolicyRef')
    e.should.have.property('CostPerKWh')
    e.should.have.property('SessionCost')
  })
})
