const config = require('config')
const express = require('express')
const https = require('https')
const fs = require('fs')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(cors())
let sslServer

const key = fs.readFileSync('.cert/key.pem')
const cert = fs.readFileSync('.cert/cert.pem')
const options = {
  key: key,
  cert: cert
}

if (config.util.getEnv('NODE_ENV') !== 'test') {
  app.use(morgan('combined'))
  const figlet = require('figlet')
  figlet('Charging Point', function (err, data) {
    if (err) {
      console.log('Something went wrong...')
      console.dir(err)
      return
    }
    console.log(data)
  })
}
console.log = config.util.getEnv('NODE_ENV') === 'test' ? function () {} : console.log
require('./api/utils/initDB')()

app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

const api = require('./api/routes/api')
app.use(config.BASE_URL, api)

mongoose.connection.on('connected', () => {
  sslServer = https.createServer(options, app)
  sslServer.listen(config.PORT, () => {
    console.log('Server is listening at port ' + config.PORT)
    app.emit('appStarted')
  })
})

process.on('SIGTERM', shutDown)
process.on('SIGINT', shutDown)
process.on('exit', shutDown)

function shutDown () {
  console.log('Received kill signal, shutting down gracefully')
  sslServer.close(() => {
    console.log('Closed out remaining connections')
    process.exit(0)
  })

  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down')
    process.exit(1)
  }, 10000)
}
module.exports = app
