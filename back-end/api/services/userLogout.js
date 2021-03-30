
const config = require('config')
const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
  const token = req.header('X-OBSERVATORY-AUTH')
  if (!token) {
    res.status(400)
    res.send('No token given')
    return next('route')
  }

  const verified = jwt.verify(token, config.TOKEN_SECRET)
  await changeAPIKey(verified._id, '').catch((err) => {
    console.log(err)
    res.status(400)
    res.send('Couldn\'t remove token')
    return next('route')
  })
  res.header('X-OBSERVATORY-AUTH', '')
  res.status(200)
  res.send()
  next()
}

function changeAPIKey (userId, token) {
  const user = require('../models/User')
  return user.findByIdAndUpdate(userId, { api_key: token })
}
