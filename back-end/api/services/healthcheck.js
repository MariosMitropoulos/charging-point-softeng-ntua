const mongoose = require('mongoose')

module.exports = (req, res, next) => {
  if (mongoose.connection.readyState === 1) { res.send({ status: 'OK' }) } else {
    res.send({ status: 'failed' })
  }
  next()
}
