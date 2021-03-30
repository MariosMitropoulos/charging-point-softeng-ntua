const common = require('../../../common')

const chai = common.chai
const server = common.server
const config = common.config
const PickRandom = common.pickRandom
const pickRandom = new PickRandom()
const dayjs = common.dayjs

let randomStation
let token

let currentDate
let firstDate

before(async () => {
  await common.deleteDatabase()
  await common.createUsers()
  await common.createSessions()
  token = await common.createAdminAndLogin()
  randomStation = await pickRandom.station()
  currentDate = dayjs(Date.now()).format('YYYYMMDD')
  firstDate = Date.now()
  firstDate = dayjs(firstDate).subtract(10, 'year').format('YYYYMMDD')
})

it('it should return all sessions', async () => {
  const res = await chai.request(server)
    .get(config.BASE_URL + '/SessionsPerStation/' + randomStation._id + '/' + firstDate + '/' + currentDate)
    .set('X-OBSERVATORY-AUTH', token)
    .send()
  res.should.have.status(200)
  const body = res.body
  console.log('Body', body)
  body.should.have.property('StationID')
  body.should.have.property('Operator')
  body.should.have.property('RequestTimestamp')
  body.should.have.property('PeriodFrom')
  body.should.have.property('PeriodTo')
  body.should.have.property('TotalEnergyDelivered')
  body.should.have.property('NumberOfChargingSessions')
  body.should.have.property('NumberOfActivePoints')
  body.should.have.property('SessionsSummaryList')
  body.SessionsSummaryList.should.have.lengthOf(body.NumberOfActivePoints)
  body.SessionsSummaryList.forEach(e => {
    e.should.have.property('PointID')
    e.should.have.property('PointSessions')
    e.should.have.property('EnergyDelivered')
  })
})
