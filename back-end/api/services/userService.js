
const config = require('config')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
module.exports = class UserService {
  async createUser (user, res) {
    const now = new Date()
    const token = jwt.sign({ _id: user.id, username: user.username, account_type: user.account_type, date: now }, config.TOKEN_SECRET)
    user.api_key = token
    bcrypt.hash(user.password, parseInt(config.SALTROUNDS)).then(function (hash) {
      user.password = hash
      User.create(user, (err) => {
        if (err) {
          res.status(400).send(err)
        } else {
          res.send({ token: token })
        }
      })
    })
  }

  async createUserF (user) {
    await User.find({ username: user.username }, (err, doc) => {
      if (err) throw (err)
      if (doc) return null
    })
    const now = new Date()
    user.api_key = await jwt.sign({ _id: user.id, username: user.username, account_type: user.account_type, date: now }, config.TOKEN_SECRET)
    user.password = await bcrypt.hash(user.password, parseInt(config.SALTROUNDS))

    const newuser = new User(user)
    await newuser.save((err) => {
      if (err) {
        if (err.code !== 11000) { throw (err) }
      }
    })
  }

  async changeUserPassword (name, newpwd) {
    const hash = bcrypt.hashSync(newpwd, parseInt(config.SALTROUNDS))
    return User.findOneAndUpdate({ username: name }, { password: hash })
  }

  getByUsername (name, cb) {
    User.find({ username: name }, (err, doc) => {
      cb(err, doc)
    })
  }
}
