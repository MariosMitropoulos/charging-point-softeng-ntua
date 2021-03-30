const config = require('config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
  const check = (variable) => {
    return (typeof (variable) !== 'undefined' && variable !== null)
  }

  if (!check(req.body.username) || !check(req.body.password)) {
    res.status(400)
    res.send('Insufficient data')
    return next('route')
  }

  const username = req.body.username
  const password = req.body.password

  const data = await getUserbyUsername(username).catch((err) => {
    console.log(err)
    res.status(400)
    res.send('Error getting username')
    return next('route')
  })

  if (!check(data)) {
    res.status(400)
    res.send('No user name like this')
    next()
  }

  const hash = String(data.password)

  const comp = bcrypt.compareSync(password, hash)

  if (comp) {
    const now = new Date()
    const token = jwt.sign({ _id: data.id, username: data.username, account_type: data.account_type, date: now }, config.TOKEN_SECRET)
    await changeAPIKey(data.id, token).catch((err) => {
      console.log(err)

      res.status(400)
      res.send('Couldn\'t change token')
    })
    res.status(200)
    res.header('X-OBSERVATORY-AUTH', token).send({ token: token })
    next()
  } else {
    res.status(400)
    res.send('Password does not match')
    return next('route')
  }
  next()
}

function getUserbyUsername (usernameInput) {
  const user = require('../models/User')
  return user.findOne({ username: usernameInput })
}

function changeAPIKey (userId, token) {
  const user = require('../models/User')
  return user.findByIdAndUpdate(userId, { api_key: token })
}
