const common = require('../../common')

const chai = common.chai
const server = common.server
const config = common.config
let token

const user = {
  username: config.DEFAULT_USER_NAME,
  password: config.DEFAULT_USER_PASSWORD
}

before((done) => {
  chai.request(server)
    .post(config.BASE_URL + '/admin/resetsessions').end((err, res) => {
      if (err) { done(err) } else {
        chai.request(server)
          .post(config.BASE_URL + '/login')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send(user)
          .end((err, s) => {
            if (err || s.statusCode === 400) { done(err) } else {
              s.body.should.have.property('token')
              token = s.body.token
              done()
            }
          })
      }
    })
})

it('should logout the user', (done) => {
  chai.request(server)
    .post(config.BASE_URL + '/logout')
    .set('X-OBSERVATORY-AUTH', token)
    .end((err, res) => {
      if (err) {
        done(err)
      }
      res.should.have.status(200)
      done()
    })
})

it('should logout the user (empty header)', (done) => {
  chai.request(server)
    .post(config.BASE_URL + '/logout')
    .set('X-OBSERVATORY-AUTH', '')
    .end((err, res) => {
      if (err) {
        console.log('HELLO')
        done()
      }
      res.should.have.status(401)
      done()
    })
})
