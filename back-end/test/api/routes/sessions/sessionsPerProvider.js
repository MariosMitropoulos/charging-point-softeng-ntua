const common = require('../../../common')

const chai = common.chai
const server = common.server
const config = common.config
const PickRandom = common.pickRandom
const pickRandom = new PickRandom()
const dayjs = common.dayjs

let randomProvider
let token

let currentDate
let firstDate

before(async () => {
  await common.deleteDatabase()
  await common.createUsers()
  await common.createSessions()
  token = await common.createAdminAndLogin()
  randomProvider = await pickRandom.electricalCompanyOperator()
  currentDate = dayjs(Date.now()).format('YYYYMMDD')
  firstDate = Date.now()
  firstDate = dayjs(firstDate).subtract(10, 'year').format('YYYYMMDD')
})

it('it should return all sessions', async () => {
  const res = await chai.request(server)
    .get(config.BASE_URL + '/SessionsPerProvider/' + randomProvider._id + '/' + firstDate + '/' + currentDate)
    .set('X-OBSERVATORY-AUTH', token)
    .send()
  res.should.have.status(200)
  const body = res.body
  console.log(body)
  body.should.have.property('ProviderID')
  body.should.have.property('ProviderName')
  body.should.have.property('SessionsSummaryList')
  body.SessionsSummaryList.forEach(e => {
    e.should.have.property('StationID')
    e.should.have.property('SessionID')
    e.should.have.property('VehicleID')
    e.should.have.property('StartedOn')
    e.should.have.property('FinishedOn')
    e.should.have.property('EnergyDelivered')
    e.should.have.property('PricePolicyRef')
    e.should.have.property('CostPerKWh')
    e.should.have.property('TotalCost')
  })
})
