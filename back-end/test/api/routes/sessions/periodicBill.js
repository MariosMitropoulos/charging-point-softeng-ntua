const common = require('../../../common')

const chai = common.chai
const server = common.server
const config = common.config
const dayjs = common.dayjs
const PickRandom = common.pickRandom
const pickRandom = new PickRandom()
let randomEV
let token

let currentDate
let firstDate
let secondDate

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

it('it should return the periodicBill', async () => {
  const res = await chai.request(server)
    .get(config.BASE_URL + '/PeriodicBill/' + randomEV._id + '/' + firstDate + '/' + currentDate)
    .set('X-OBSERVATORY-AUTH', token)
    .send()
  res.should.have.status(200)
  const body = res.body
  body.should.have.property('result')
  Number(body.result).should.be.at.least(0)
})
