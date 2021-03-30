const common = require('../../../common')

const chai = common.chai
const server = common.server
const config = common.config
const user = {
  username: config.DEFAULT_USER_NAME,
  password: config.DEFAULT_USER_PASSWORD
}

let token
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

it('it should find a user', (done) => {
  chai.request(server)
    .get(config.BASE_URL + '/admin/users/' + user.username)
    .set('X-OBSERVATORY-AUTH', token)
    .end((err, res) => {
      if (err) {
        done(err)
      }
      res.should.have.status(200)
      done()
    })
})

it('it should not find a user', (done) => {
  chai.request(server)
    .get(config.BASE_URL + '/admin/users/' + '')
    .set('X-OBSERVATORY-AUTH', token)
    .end((err, res) => {
      if (err) {
        done(err)
      }
      res.should.have.status(400)
      done()
    })
})

it('it should not find a user', (done) => {
  chai.request(server)
    .get(config.BASE_URL + '/admin/users/' + 'sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss')
    .set('X-OBSERVATORY-AUTH', token)
    .end((err, res) => {
      if (err) {
        done(err)
      }
      res.should.have.status(204)
      done()
    })
})
