const common = require('../../common')

const chai = common.chai
const server = common.server
const config = common.config
const createAdminAndLogin = common.createAdminAndLogin
const deleteDatabase = common.deleteDatabase
const createUsers = common.createUsers

before(async () => {
  await deleteDatabase()
  await createUsers()
  await createAdminAndLogin()
})

it('should login the user', (done) => {
  const user = {
    username: config.DEFAULT_USER_NAME,
    password: config.DEFAULT_USER_PASSWORD
  }
  chai.request(server)
    .post(config.BASE_URL + '/login')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send(user)
    .end((err, res) => {
      if (err) {
        done(err)
      }
      res.should.have.status(200)
      res.body.should.have.property('token')
      res.body.token.should.have.lengthOf.above(2)
      done()
    })
})

it('should not login the user- wrong user/password', (done) => {
  const user = {
    username: '',
    password: ''
  }
  chai.request(server)
    .post('/login')
    .set('content-type', 'application/x-www-form-urlencoded')
    .set('Accept', 'application/json')
    .send(user)
    .end((_err, res) => {
      res.should.have.property('status', 404)
      done()
    })
})

it('should not login the user- empty parameters', (done) => {
  chai.request(server)
    .post('/login')
    .set('Accept', 'application/json')
    .end((_err, res) => {
      res.should.have.status(404)
      done()
    })
})
