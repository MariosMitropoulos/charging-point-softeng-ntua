const common = require('../../../common')

const chai = common.chai
const server = common.server
const config = common.config
const PickRandom = common.pickRandom
const pickRandom = new PickRandom()
let randomEV
let token

let session1ID
let session2ID
before(async () => {
  await common.deleteDatabase()
  await common.createUsers()
  await common.createSessions()
  token = await common.createAdminAndLogin()

  randomEV = await pickRandom.vehicle()
  const sessions = randomEV.sessions
  session1ID = await sessions[0]
  session2ID = await sessions[1]
})

it('it should return kilometers driven', async () => {
  console.log(session1ID)
  const res = await chai.request(server)
    .get(config.BASE_URL + '/KilometersDriven/' + randomEV._id + '/' + session1ID + '/' + session2ID)
    .set('X-OBSERVATORY-AUTH', token)
    .send()
  res.should.have.status(200)
  const body = res.body
  body.should.have.property('result')
  body.result.should.be.at.least(0)
})

it('it should throw chronological error', async () => {
  try {
    console.log(session1ID)
    const res = await chai.request(server)
      .get(config.BASE_URL + '/KilometersDriven/' + randomEV._id + '/' + session2ID + '/' + session1ID)
      .set('X-OBSERVATORY-AUTH', token)
      .send()
    res.should.have.status(400)
  } catch (err) {
    err.should.not.be.equal(undefined)
  }
})
