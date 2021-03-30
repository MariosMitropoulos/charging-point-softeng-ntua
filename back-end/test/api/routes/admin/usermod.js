const common = require('../../../common')

const chai = common.chai
const server = common.server
const config = common.config
const user = {
  username: config.DEFAULT_USER_NAME,
  password: config.DEFAULT_USER_PASSWORD
}
const newuser = {
  username: 'Goodwin_Rylee',
  password: 'EPw3mFPQwP8auVc'
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

it('it should create a user', (done) => {
  chai.request(server)
    .post(config.BASE_URL + '/admin/usermod/' + newuser.username + '/' + newuser.password)
    .set('X-OBSERVATORY-AUTH', token)
    .send(newuser)
    .end((err, res) => {
      if (err) {
        done(err)
      }
      res.should.have.status(200)
      done()
    })
})

it('it should not create a user but change password', (done) => {
  chai.request(server)
    .post(config.BASE_URL + '/admin/usermod/' + newuser.username + '/' + newuser.password)
    .set('X-OBSERVATORY-AUTH', token)
    .send(newuser)
    .end((err, res) => {
      if (err) {
        done(err)
      }
      res.should.have.status(200)
      done()
    })
})

it('it should not create a user- wrong credentials', (done) => {
  chai.request(server)
    .post(config.BASE_URL + '/admin/usermod/' + '' + '/' + '')
    .set('X-OBSERVATORY-AUTH', token)
    .send(newuser)
    .end((err, res) => {
      if (err) {
        done(err)
      }
      res.should.have.status(404)
      done()
    })
})
