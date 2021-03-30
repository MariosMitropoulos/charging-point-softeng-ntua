const common = require('../../../common')

const chai = common.chai
const server = common.server
const config = common.config

const PickRandom = common.pickRandom
const pickRandom = new PickRandom()

let randomPoint
let token

before(async () => {
  await common.deleteDatabase()
  await common.createUsers()
  await common.createSessions()
  token = await common.createAdminAndLogin()
  randomPoint = await pickRandom.point()
})

it('it should delete a point', async () => {
  const res = await chai.request(server)
    .post(config.BASE_URL + '/point/delete/' + randomPoint._id)
    .set('X-OBSERVATORY-AUTH', token)
    .send()
  const body = res.body
  res.should.have.status(200)
  body.should.have.property('result')
  body.result.should.be.equal('OK')
})
