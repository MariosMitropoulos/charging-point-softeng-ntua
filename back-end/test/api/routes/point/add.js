const common = require('../../../common')

const chai = common.chai
const server = common.server
const config = common.config
const PickRandom = common.pickRandom
const pickRandom = new PickRandom()

let randomStation
let token

before(async () => {
  await common.deleteDatabase()
  await common.createUsers()
  await common.createSessions()
  token = await common.createAdminAndLogin()
  randomStation = await pickRandom.station()
})

it('it should add a point', async () => {
  const res = await chai.request(server)
    .post(config.BASE_URL + '/point/add/' + randomStation._id)
    .set('X-OBSERVATORY-AUTH', token)
    .send()
  res.should.have.status(200)
})
