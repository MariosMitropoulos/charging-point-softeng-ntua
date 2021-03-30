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

before(async () => {
  await common.deleteDatabase()
  await common.createUsers()
  await common.createSessions()
  token = await common.createAdminAndLogin()

  randomStation = await pickRandom.station()
  currentDate = dayjs(Date.now()).format('YYYYMMDD')
})

it('it should return the cost per station', async () => {
  const res = await chai.request(server)
    .get(config.BASE_URL + '/CostPerStation/' + randomStation._id + '/' + '20150101' + '/' + currentDate)
    .set('X-OBSERVATORY-AUTH', token)
    .send()
  res.should.have.status(200)
  const body = res.body
  body.should.have.property('result')
})
